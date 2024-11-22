import useMovilStore from "@stores/movil";
import { memo } from "react";

function AppTabs() {
    const process = useMovilStore((state) => state.process)
    const maximizedProcess = useMovilStore((state) => state.maximizeProcess)

    return (
        <div className="flex justify-between">
            {
                process.map((p) => {
                    return (
                        <div key={p.name} onClick={() => maximizedProcess(p)}
                            className="flex cursor-pointer m-1" >
                            <img src={p.urlIcon} alt={p.name} className="w-8"/>
                        </div>
                    )
                })
            }
        </div>
    )
}

export default memo(AppTabs)