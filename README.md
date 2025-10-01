# rope.core - Digital Twin Interface

Минималистичный интерфейс Digital Twin на Next.js 14 с TypeScript и Tailwind CSS.

## Технологии

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Lucide React (иконки)
- Шрифт LABco (локально)

## Установка и запуск

```bash
# Установка зависимостей
npm install

# Запуск в режиме разработки
npm run dev

# Сборка для продакшена
npm run build

# Запуск продакшен версии
npm start
```

## Структура проекта

```
app/
├── layout.tsx          # Основной layout с подключением шрифта
├── page.tsx           # Главная страница с карточками
├── globals.css        # Глобальные стили и CSS-переменные
└── components/
    ├── TopBar.tsx     # Верхняя панель с логотипом и статусом
    ├── SectionCard.tsx # Универсальная карточка секции
    └── BottomNav.tsx  # Нижняя навигация
```

## Шрифт LABco

Замените файл `/public/fonts/LABco.ttf` на реальный файл шрифта LABco.

## Следующие шаги

В каждой карточке есть комментарии `// TODO: data binding step-1` - это места для добавления данных и функционала.

## Цветовая схема

- Фон: `#0B0F12` (почти чёрный)
- Текст: `#E5E7EB` (светло-серый)
- Акцент: `#00BFA6` (бирюзовый)
- Карточки: `#111827` (тёмно-серый)
