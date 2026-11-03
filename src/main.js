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
    `Totali: ${totali} · Completati: ${completati} · Rimanenti: ${rimanenti}`
}
 
// ---------- 4. AVVIO ---------- 
render()
 
//Es 3: prova del disallineamento
const fantasma = document.createElement("li")
fantasma.textContent = "Task fantasma inserito a mano"
lista.append(fantasma)
*/



//MAIN PARTE 2 AGGIORNATO E COMPLETO (con le sfide della sezione 09)
import "./style.css"

/* ================= 1. STATO ================= */
const CHIAVE = "todo-tasks"
const CHIAVE_NOME = "todo-nome"   // Es 7: chiave diversa da quella dei task

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
const areaBenvenuto = document.querySelector("#benvenuto")  // Es 7
const messaggio = document.querySelector("#messaggio")  // Es 8
const azioni = document.querySelector("#azioni")        // Es 9

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

  // Es 8: frase reattiva, ricavata dallo stato (nessun nuovo campo nello stato)
  const totali = tasks.length
  const restanti = totali - completati
  // prima la lista vuota: 0 completati su 0 task sembrerebbe "tutti completati"
  messaggio.textContent =
    totali === 0 ? "Non hai task. Buona giornata."
      : restanti === 0 ? "Fatto tutto. Complimenti."
        : `Ti restano ${restanti} task su ${totali}.`

  // Es 9: il pulsante esiste solo se c'è almeno un task completato
  azioni.innerHTML = completati > 0
    ? `<button data-azione="elimina-completati">Elimina completati (${completati})</button>`
    : ""
}

// Es 7: saluto persistente. Decide il render guardando se il nome esiste
function mostraBenvenuto() {
  const nome = localStorage.getItem(CHIAVE_NOME)

  // nome non ancora salvato: disegno il campo e il pulsante
  if (!nome) {
    areaBenvenuto.innerHTML = `
      <input type="text" id="campo-nome" placeholder="Come ti chiami?" autocomplete="off">
      <button id="salva-nome">Salva</button>
    `
    const campoNome = document.querySelector("#campo-nome")

    const salvaNome = () => {
      const valore = campoNome.value.trim()
      if (valore === "") return
      localStorage.setItem(CHIAVE_NOME, valore)   // è già una stringa: niente JSON.stringify
      mostraBenvenuto()                           // ridisegna: ora mostra il saluto
    }

    document.querySelector("#salva-nome").addEventListener("click", salvaNome)
    campoNome.addEventListener("keydown", (evento) => {
      if (evento.key === "Enter") salvaNome()
    })
    return
  }

  // nome già salvato: mostro solo il saluto (textContent: il nome non viene letto come HTML)
  const saluto = document.createElement("p")
  saluto.textContent = `Bentornato, ${nome}`
  areaBenvenuto.replaceChildren(saluto)
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

// Es 9: stessa operazione di deleteTask, cambia solo il predicato (tengo i non completati)
function eliminaCompletati() {
  if (!confirm("Vuoi davvero eliminare tutti i task completati?")) return
  aggiornaStato(tasks.filter(t => !t.completed))
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

// Es 9: delega degli eventi. Un solo listener fisso su #azioni, il pulsante viene ricreato a ogni render()
azioni.addEventListener("click", (evento) => {
  if (evento.target.dataset.azione === "elimina-completati") {
    eliminaCompletati()
  }
})

/* ================= 7. AVVIO ================= */
mostraBenvenuto()
render()
