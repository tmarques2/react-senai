import './App.css'
import Profile from './components/Profile.jsx'
import Bio from './components/Bio.jsx'

function App() {
  return (
    <div className="appContainer">
      <Profile />
      <Bio 
      nome="Edward Cullen"
      data="20 de Junho de 1901"
      lugar="Chicago, EUA"
      oqfaz="Vampiro"
      origem="Clã Cullen"
      descricao="Edward Cullen é um vampiro do clã Cullen, conhecido por ser muito lindo rs e por sua habilidade de ler mentes. Ele se casa com a sem sal da Bella."
    />
    </div>
  );
}

export default App
