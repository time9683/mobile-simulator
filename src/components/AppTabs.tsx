import useMovilStore from "@stores/movil";
import { memo } from "react";

function AppTabs() {
    const process = useMovilStore((state) => state.process)
    const changePage = useMovilStore((state) => state.changePage)

    return (
        <div className="flex justify-between">
            {
                process.map((p) => {
                    return (
                        <div key={p.name} onClick={() => changePage(p.name)}
                            className="flex cursor-pointer m-1 " >
                            <img src={p.urlIcon} alt={p.name} className="w-8"/>
                        </div>
                    )
                })
            }
        </div>
    )
}

export default memo(AppTabs)