import React, { useState } from 'react';
import { Film, User, Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';

export const AuthPage = ({ onLoginSuccess, onCancel }) => {
  const [isRegister, setIsRegister] = useState(false);
  
  // Поля форми
  const [loginInput, setLoginInput] = useState(''); // Для логіну: email або username
  const [username, setUsername] = useState('');     // Для реєстрації: нікнейм
  const [email, setEmail] = useState('');           // Для реєстрації: пошта
  const [password, setPassword] = useState('');     // Пароль
  
  const [error, setError] = useState('');

  // Отримання базик зареєстрованих користувачів
  const getRegisteredUsers = () => {
    try {
      const saved = localStorage.getItem('plota_registered_users');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  };

  const handleAuthSubmit = (e) => {
    e.preventDefault();
    setError('');

    const registeredUsers = getRegisteredUsers();

    if (isRegister) {
      // --- РЕЄСТРАЦІЯ ---
      const trimmedUsername = username.trim();
      const trimmedEmail = email.trim().toLowerCase();

      if (!trimmedUsername || !trimmedEmail || !password) {
        setError('Будь ласка, заповніть усі поля');
        return;
      }

      if (trimmedUsername.length < 3) {
        setError('Нікнейм має містити щонайменше 3 символи');
        return;
      }

      // Перевірка на унікальність нікнейму (без урахування регістру)
      const isUsernameTaken = registeredUsers.some(
        (u) => u.username && u.username.toLowerCase() === trimmedUsername.toLowerCase()
      );
      if (isUsernameTaken) {
        setError('Цей нікнейм уже зайнятий. Оберіть інший!');
        return;
      }

      // Перевірка на унікальність email
      const isEmailTaken = registeredUsers.some(
        (u) => u.email && u.email.toLowerCase() === trimmedEmail
      );
      if (isEmailTaken) {
        setError('Користувач із такою поштою вже існує');
        return;
      }

      // Створення нового юзера
      const newUser = {
        id: 'usr-' + Date.now(),
        username: trimmedUsername,
        name: trimmedUsername, // Ім'я для відображення дорівнює нікнейму
        email: trimmedEmail,
        password: password
      };

      const updatedUsers = [...registeredUsers, newUser];
      localStorage.setItem('plota_registered_users', JSON.stringify(updatedUsers));

      // Успішна авторизація
      onLoginSuccess(newUser);

    } else {
      // --- ВХІД (За нікнеймом АБО за поштою) ---
      const trimmedInput = loginInput.trim();

      if (!trimmedInput || !password) {
        setError('Введіть нікнейм/email та пароль');
        return;
      }

      // Шукаємо користувача за нікнеймом або email
      const foundUser = registeredUsers.find(
        (u) =>
          (u.username && u.username.toLowerCase() === trimmedInput.toLowerCase()) ||
          (u.email && u.email.toLowerCase() === trimmedInput.toLowerCase())
      );

      if (!foundUser) {
        setError('Користувача з таким нікнеймом або email не знайдено');
        return;
      }

      if (foundUser.password !== password) {
        setError('Невірний пароль');
        return;
      }

      // Успішний вхід
      onLoginSuccess(foundUser);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 font-sans animate-fadeIn">
      <div className="bg-light-surface dark:bg-dark-surface p-6 sm:p-8 rounded-md border border-light-border dark:border-dark-border shadow-xl space-y-6">
        
        {/* Заголовок */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xs bg-dark-accent text-slate-950 font-bold mb-1">
            <Film className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-heading font-bold uppercase tracking-wider text-light-textPrimary dark:text-dark-textPrimary">
            {isRegister ? 'Реєстрація в Plota' : 'Вхід в акаунт'}
          </h1>
          <p className="text-xs text-light-textSecondary dark:text-dark-textSecondary">
            {isRegister
              ? 'Створіть свій унікальний профіль для оцінок та рецензій'
              : 'Увійдіть за допомогою нікнейму або електронної пошти'}
          </p>
        </div>

        {/* Повідомлення про помилку */}
        {error && (
          <div className="p-3 bg-red-900/20 border border-red-800 text-red-400 text-xs font-sans flex items-center gap-2 rounded-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Форма */}
        <form onSubmit={handleAuthSubmit} className="space-y-4">
          {isRegister ? (
            <>
              {/* Нікнейм */}
              <div className="space-y-1">
                <label className="text-[11px] font-sans font-bold uppercase tracking-wider text-light-textSecondary dark:text-dark-textSecondary">
                  Нікнейм (унікальний)
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-light-textSecondary dark:text-dark-textSecondary" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="наприклад: movie_geek"
                    className="w-full pl-9 pr-3 py-2 text-xs font-sans bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border rounded-xs text-light-textPrimary dark:text-dark-textPrimary focus:outline-none focus:border-dark-accent"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label className="text-[11px] font-sans font-bold uppercase tracking-wider text-light-textSecondary dark:text-dark-textSecondary">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-light-textSecondary dark:text-dark-textSecondary" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="user@example.com"
                    className="w-full pl-9 pr-3 py-2 text-xs font-sans bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border rounded-xs text-light-textPrimary dark:text-dark-textPrimary focus:outline-none focus:border-dark-accent"
                    required
                  />
                </div>
              </div>
            </>
          ) : (
            /* Вхід: Нікнейм або Email */
            <div className="space-y-1">
              <label className="text-[11px] font-sans font-bold uppercase tracking-wider text-light-textSecondary dark:text-dark-textSecondary">
                Нікнейм або Email
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-light-textSecondary dark:text-dark-textSecondary" />
                <input
                  type="text"
                  value={loginInput}
                  onChange={(e) => setLoginInput(e.target.value)}
                  placeholder="Введіть нікнейм або пошту..."
                  className="w-full pl-9 pr-3 py-2 text-xs font-sans bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border rounded-xs text-light-textPrimary dark:text-dark-textPrimary focus:outline-none focus:border-dark-accent"
                  required
                />
              </div>
            </div>
          )}

          {/* Пароль */}
          <div className="space-y-1">
            <label className="text-[11px] font-sans font-bold uppercase tracking-wider text-light-textSecondary dark:text-dark-textSecondary">
              Пароль
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-light-textSecondary dark:text-dark-textSecondary" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 text-xs font-sans bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border rounded-xs text-light-textPrimary dark:text-dark-textPrimary focus:outline-none focus:border-dark-accent"
                required
              />
            </div>
          </div>

          {/* Кнопка відправки */}
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xs bg-dark-accent text-slate-950 text-xs font-sans font-bold uppercase hover:opacity-90 transition-opacity cursor-pointer pt-3"
          >
            <span>{isRegister ? 'Зареєструватися' : 'Увійти'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Перемикач Реєстрація / Вхід */}
        <div className="pt-2 border-t border-light-border dark:border-dark-border text-center flex flex-col items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setIsRegister(!isRegister);
              setError('');
            }}
            className="text-xs text-light-textSecondary dark:text-dark-textSecondary hover:text-dark-accent transition-colors cursor-pointer font-sans"
          >
            {isRegister
              ? 'Вже є акаунт? Увійти'
              : 'Немає акаунта? Зареєструватися'}
          </button>

          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="text-[11px] text-light-textSecondary dark:text-dark-textSecondary hover:underline cursor-pointer"
            >
              Скасувати
            </button>
          )}
        </div>

      </div>
    </div>
  );
};