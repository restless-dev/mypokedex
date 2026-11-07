# myPokedex

![myPokedex](https://github.com/user-attachments/assets/c21a7bc3-b0ad-4577-ad00-7c48282b71b7)

**myPokedex** is a interactive web application designed to simulate a physical Pokedex. Built with **React, TypeScript, Zustand and GraphQL**.
It includes an audio engine with a BGM, Pokemon cries and custom sounds for booting, browsing and pressing buttons.

Using the built-in buttons, **or your keyboard**, you can power it on, browse generations and Pokemon, search via the keypad, and view Pokemon statistics.

## Features

#### **Turn it on and browse Pokemon:** *Fetches a generation of Pokemon instantly from the `@favware/graphql-pokemon` API, storing them locally fast browsing.*
![Browse](https://github.com/user-attachments/assets/ae5488e2-073a-4f95-95ce-7d09a0219b8b)

#### **Adjust your size and volume preferences:** *A floating top bar allows you to adjust global volume and zoom settings, it also includes a overlaying user guide.*
![Browse](https://github.com/user-attachments/assets/5d06043e-8c0e-469d-89db-994940ed9fc8)

## Operation & Stack

This project is a **Pure Frontend SPA** application. All logic is handled in the browser.

### Client

The client was built with **React** and **Vite**.

The main technologies used here are:

**Zustand**: It dictates the power state, the view mode, and caches the GraphQL data blocks.

**GraphQL-Request**: Used to query the external `@favware` API.

**Tailwind**: Utilized in building and customizing the layout and some of its design logic.

**Framer Motion**: Used for the spring animations of the Pokémon sprites and UI transitions.

**Native Web Audio API**: Managed to prevent audio overlap and doubling during rapid user inputs.

## How to Run

This project requires **Node.js** and **NPM** installed.

#### 1. Clone the project:
```bash
git clone https://github.com/paulo-ads/myPokedex.git
cd myPokedex
```

#### 2. Install dependencies:
```bash
npm install
```

#### 3. Start the Development Server:
```bash
npm run dev
```

#### 4. Access the Application:
Open your browser and navigate to the URL provided by Vite (usually `http://localhost:5173`).

## Disclaimer
*This application is an unofficial, non-profit, open-source project created solely for educational purposes.* 

*Pokemon, Pokemon character names, sprites, audio, and all related properties are trademarks and copyrights of **Nintendo**, **Game Freak**, **Creatures Inc.**, and **The Pokémon Company**.* 
