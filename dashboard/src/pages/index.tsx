import "../App.css";
import Footer from "@components/Footer";
import NavBar from "@components/NavBar";

import GuildList from "@components/GuildList";

function App() {
  return (
    <div>
      <NavBar />
      <main>
        <GuildList />
      </main>
      <Footer /> {/* Move Footer here */}
    </div>
  );
}

export default App;
