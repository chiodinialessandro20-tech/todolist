/*
//MAIN PARTE 1
import "./style.css"

// ---------- 1. STATO ---------- 
let tasks = [
  { id: 1, title: "Studiare per la verifica", completed: false },
  { id: 2, title: "Comprare il pane", completed: true },
  { id: 3, title: "Finire il progetto TPSIT", completed: false },
  { id: 4, title: "Giocare a calcio", completed: false }   // Es 1: aggiunta di una nuova task
]

// ---------- 2. RIFERIMENTI ALLA PAGINA ---------- 
const lista = document.querySelector("#lista")
const info = document.querySelector("#info")

// ---------- 3. VIEW ---------- 
function render() {
  lista.innerHTML = tasks
    .map(t => `
      <li class="${t.completed ? "fatto" : ""}" data-id="${t.id}">
        <span class="titolo">${t.title}</span>
        <button class="elimina" data-id="${t.id}">×</button>
      </li>
    `)
    .join("")

  // Es 2: aggiunta conteggio dei task da fare
  const totali = tasks.length
  const completati = tasks.filter(t => t.completed).length
  const rimanenti = totali - completati

  info.textContent =
    `Totali: ${totali} · Completati: ${completati} · Rimaneti: ${rimanenti}`
}

// ---------- 4. AVVIO ---------- 
render()

//Es 3: prova del disallineamento
const fantasma = document.createElement("li")
fantasma.textContent = "Task fantasma inserito a mano"
lista.append(fantasma)
*/



//MAIN PARTE 2 AGGIORNATO E COMPLETO
import "./style.css"

/* ================= 1. STATO ================= */
const CHIAVE = "todo-tasks"

/*function caricaStato() {
  const testo = localStorage.getItem(CHIAVE)
  if (testo === null) return []
  return JSON.parse(testo)
}*/

//Es 5 resa caricaStato() resistente
function caricaStato() {
  const testo = localStorage.getItem(CHIAVE)
  if (testo === null) return []

  try {
    const dati = JSON.parse(testo)
    // difesa in più: deve essere proprio un array
    return Array.isArray(dati) ? dati : []
  } catch (errore) {
    console.error("Dati salvati non validi, riparto da zero:", errore.message)
    return []
  }
}

let tasks = caricaStato()

/* ================= 2. RIFERIMENTI ================= */
const lista = document.querySelector("#lista")
const info = document.querySelector("#info")
const form = document.querySelector("#form-task")
const campo = document.querySelector("#campo-task")

/* ================= 3. PERSISTENZA ================= */
function salvaStato() {
  localStorage.setItem(CHIAVE, JSON.stringify(tasks))
}

// Es 4: una sola funzione per aggiornare lo stato, salvare e ridisegnare
function aggiornaStato(nuoviTasks) {
  tasks = nuoviTasks
  salvaStato()
  render()
}

/* ================= 4. VIEW ================= */
function render() {
  lista.innerHTML = tasks
    .map(t => `
      <li class="${t.completed ? "fatto" : ""}" data-id="${t.id}">
        <span class="titolo">${t.title}</span>
        <button class="elimina" data-id="${t.id}">×</button>
      </li>
    `)
    .join("")

  const completati = tasks.filter(t => t.completed).length
  info.textContent = `Totali: ${tasks.length} · Completati: ${completati}`
}

/* ================= 5. AZIONI ================= */

/*function addTask(title) {
  const pulito = title.trim()
  if (pulito === "") return

  tasks = [...tasks, { id: Date.now(), title: pulito, completed: false }]
  salvaStato()
  render()
}

function toggleTask(id) {
  tasks = tasks.map(t =>
    t.id === id ? { ...t, completed: !t.completed } : t
  )
  salvaStato()
  render()
}

function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id)
  salvaStato()
  render()
}*/

// Es 4: azioni aggiornate che usano aggiornaStato()
function addTask(title) {
  const pulito = title.trim()
  if (pulito === "") return
  aggiornaStato([...tasks, { id: Date.now(), title: pulito, completed: false }])
}

function toggleTask(id) {
  aggiornaStato(
    tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t)
  )
}

function deleteTask(id) {
  aggiornaStato(tasks.filter(t => t.id !== id))
}

/* ================= 6. EVENTI ================= */
form.addEventListener("submit", (evento) => {
  evento.preventDefault()
  addTask(campo.value)
  campo.value = ""
  campo.focus()
})

lista.addEventListener("click", (evento) => {
  const elemento = evento.target

  if (elemento.classList.contains("elimina")) {
    deleteTask(Number(elemento.dataset.id))
    return
  }

  const riga = elemento.closest("li")
  if (riga) {
    toggleTask(Number(riga.dataset.id))
  }
})

/* ================= 7. AVVIO ================= */
render()