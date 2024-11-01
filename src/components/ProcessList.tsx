"use client"

import { useState, useEffect } from "react"
import { Clock, Cpu, HardDrive } from "lucide-react"
import useMovilStore from "@stores/movil"

interface Process {
  pid: number
  user: string
  priority: number
  cpu: number
  memory: number
  time: string
  command: string
}

export default function ProcessList() {
  const [processes, setProcesses] = useState<Process[]>([
    { pid: 1, user: "root", priority: 20, cpu: 0.1, memory: 0.1, time: "0:32.28", command: "/sbin/init" },
    { pid: 3195, user: "time", priority: 20, cpu: 4.2, memory: 2.1, time: "9:03.00", command: "Chrome" },
    { pid: 3203, user: "time", priority: 20, cpu: 4.2, memory: 2.0, time: "0:00.00", command: "Galeria" },
    { pid: 3209, user: "time", priority: 20, cpu: 4.2, memory: 2.1, time: "0:00.00", command: "netflix" },
    { pid: 3210, user: "time", priority: 20, cpu: 4.2, memory: 2.0, time: "0:00.16", command: "whatsapp" },
  ])
  const initTime = useMovilStore((state)=> state.initTime)

  const [systemInfo, setSystemInfo] = useState({
    cpuUsage: 67,
    memoryUsage: 69,
    uptime:  Math.floor((Date.now() - initTime) / 1000),
    loadAverage: [0.5, 1.88, 1.88],
    tasks: { total: 5 , running: 1, sleeping: 4 }
  })

  useEffect(() => {
    const interval = setInterval(() => {
      setProcesses(prev => prev.map(process => ({
        ...process,
        cpu: Number((Math.random() * 5).toFixed(1)),
        memory: Number((Math.random() * 3).toFixed(1))
      })))

      setSystemInfo({
        cpuUsage: Number((Math.random() * 100).toFixed(1)),
        memoryUsage: systemInfo.memoryUsage,
        uptime: Math.floor((Date.now() - initTime) / 1000),
        loadAverage: [Math.random() * 2, Math.random() * 2, Math.random() * 2],
        tasks: { total: 5 , running: 1, sleeping: 4 }
      })


    }, 2000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="w-full  bg-gray-800 text-gray-200 shadow-lg overflow-hidden h-screen">
      <div className="p-6 space-y-6">
        <h2 className="text-2xl font-mono font-bold">System Monitor</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Cpu className="h-5 w-5" />
              <span className="text-sm font-medium">CPU Usage</span>
            </div>
            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500"
                style={{ width: `${systemInfo.cpuUsage}%` }}
              ></div>
            </div>
            <div className="text-xs text-gray-400">
              {systemInfo.cpuUsage}% used
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <HardDrive className="h-5 w-5" />
              <span className="text-sm font-medium">Memory Usage</span>
            </div>
            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500"
                style={{ width: `${systemInfo.memoryUsage}%` }}
              ></div>
            </div>
            <div className="text-xs text-gray-400">
              {systemInfo.memoryUsage}% used
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-4 text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>Uptime: {systemInfo.uptime}</span>
          </div>
          <div>
            Load Average: {systemInfo.loadAverage.map((load)=> load.toFixed(2)).join(" ")}
          </div>
          <div>
            Tasks: {systemInfo.tasks.total} total, {systemInfo.tasks.running} running, {systemInfo.tasks.sleeping} sleeping
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-700">
            <tr>
              <th className="px-4 py-2 text-left">PID</th>
              <th className="px-4 py-2 text-left">USER</th>
              <th className="px-4 py-2 text-left">PRI</th>
              <th className="px-4 py-2 text-left">CPU%</th>
              <th className="px-4 py-2 text-left">MEM%</th>
              <th className="px-4 py-2 text-left">TIME+</th>
              <th className="px-4 py-2 text-left">Command</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {processes.map((process) => (
              <tr key={process.pid} className="hover:bg-gray-700">
                <td className="px-4 py-2 font-mono">{process.pid}</td>
                <td className="px-4 py-2 font-mono">{process.user}</td>
                <td className="px-4 py-2 font-mono">{process.priority}</td>
                <td className="px-4 py-2 font-mono">
                  <div className="flex items-center gap-2">
                    <div className="w-16 bg-gray-700 h-2 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500"
                        style={{ width: `${process.cpu * 20}%` }}
                      ></div>
                    </div>
                    {process.cpu}
                  </div>
                </td>
                <td className="px-4 py-2 font-mono">
                  <div className="flex items-center gap-2">
                    <div className="w-16 bg-gray-700 h-2 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500"
                        style={{ width: `${process.memory * 33}%` }}
                      ></div>
                    </div>
                    {process.memory}
                  </div>
                </td>
                <td className="px-4 py-2 font-mono">{process.time}</td>
                <td className="px-4 py-2 font-mono text-xs truncate max-w-[200px]">
                  {process.command}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}