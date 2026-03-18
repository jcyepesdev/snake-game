# 🐍 Snake Game - JavaScript Vanilla

Un juego clásico de la culebrita desarrollado con **HTML, CSS y JavaScript puro (Vanilla JS)**, enfocado en demostrar fundamentos sólidos de desarrollo frontend, lógica de videojuegos y buenas prácticas de ingeniería.

---

## 🚀 Demo

👉 Próximamente (puedes desplegarlo en Vercel, Netlify o GitHub Pages)

---

## 🧠 Sobre el proyecto

Este proyecto no es solo un juego, es una implementación pensada para:

- Practicar **lógica de programación**
- Entender cómo funciona un **game loop real**
- Aplicar principios de **arquitectura frontend**
- Simular un proyecto **listo para producción**

---

## 🎮 Features

### 🔥 Gameplay
- Movimiento clásico tipo Snake
- Colisiones con paredes y consigo mismo
- Generación aleatoria de comida
- Sistema de puntuación

### ⚙️ Mecánicas avanzadas
- Aumento de velocidad cada 5 puntos
- Sistema de pausa (`P`)
- Reinicio rápido (`R` o botón)
- Récord persistente con `localStorage`

### 🧠 Arquitectura
- Separación clara de responsabilidades:
  - `update()` → lógica
  - `draw()` → render
  - `input` → eventos
  - `state` → estado global

### 🎨 UI / UX
- Overlay de pausa
- Pantalla de Game Over
- Score en tiempo real
- Responsive

### 📱 Mobile Ready
- Controles táctiles (botones)
- Soporte para swipe gestures
- Vibración en dispositivos compatibles

---

## 🧩 Tecnologías utilizadas

- HTML5 (semántico)
- CSS3 (responsive + modern layout)
- JavaScript (Vanilla)
- Canvas API
- LocalStorage

---

## 🕹️ Controles

### 💻 Desktop
- ⬆️ ⬇️ ⬅️ ➡️ → mover
- `P` → pausar
- `R` → reiniciar

### 📱 Mobile
- Botones en pantalla
- Swipe (deslizar para mover)

---

## 📂 Estructura del proyecto

```bash
snake-game/
│
├── index.html
├── assets/
│   ├── css/
│   │   └── styles.css
│   ├── js/
│   │   └── main.js
│   └── img/
│       └── snake.png