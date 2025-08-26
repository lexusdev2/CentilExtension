import { servers } from "../data";
import { Link } from "react-router-dom";

function GuildList() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-col-3">
      {servers.map((guild) => (
        <Link
          to={`/${guild.id}`}
          key={guild.id}
          className="flex flex-col p-4 border border-gray-200/25 hover:border-gray-200/50 transition-colors rounded-md mb-2 justify-center items-center relative"
        >
          <div className="flex items-center">
            <img
              src={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.webp?size=128`}
              alt={guild.name}
              className="size-14 rounded-full"
              aria-hidden
            />
            <img
              src={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.webp?size=128`}
              alt={guild.name}
              className="size-14 rounded-full"
            />
            <h3 className="ml-2">{guild.name}</h3>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default GuildList;
