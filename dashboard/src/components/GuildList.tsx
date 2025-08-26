import { servers } from "../data";
import { Link } from "react-router-dom";

function GuildList() {
    return (
        <div className="w-fit mx-auto">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
                {servers.map((guild) => (
                    <div
                        key={guild.id}
                        className="flex flex-col p-4 border border-gray-200/25 hover:border-gray-200/50 transition-colors rounded-md mb-2 justify-center items-center relative overflow-hidden"
                    >
                        <img
                            src={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.webp?size=256`}
                            alt={guild.name}
                            className="absolute inset-0 blur-sm w-full h-1/2 -z-20 object-cover brightness-[20%]"
                            aria-hidden
                        />
                        <img
                            src={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.webp?size=128`}
                            alt={guild.name}
                            className="size-14 rounded-full mb-2"
                        />
                        <h3 className="mb-4 font-semibold text-center line-clamp-1">
                            {guild.name}
                        </h3>
                        <Link
                            to={`/guild/${guild.id}`}
                            className="btn btn-primary btn-sm"
                        >
                            Configure/Setup
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default GuildList;
