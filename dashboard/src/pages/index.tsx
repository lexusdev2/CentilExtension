import "../App.css";
import Footer from "@components/Footer";
import NavBar from "@components/NavBar";

import GuildList from "@components/GuildList";
import DefaultLayout from "@layouts/DefaultLayout";

function App() {
  return (
    <DefaultLayout>
      <GuildList />
    </DefaultLayout>
  );
}

export default App;
