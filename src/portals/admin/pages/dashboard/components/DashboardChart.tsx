import { useMemo, useState, useRef } from "react"
import { BarChart3 } from "lucide-react"
import { format } from "date-fns"

interface ChartData {
     date: string
     value: number
}

const DashboardChart = ({ data }: { data: ChartData[] }) => {
     const containerRef = useRef<HTMLDivElement>(null)
     const [hoveredData, setHoveredData] = useState<ChartData | null>(null)
     const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 })

     // Calculate scalable path for SVG
     const { points, path, areaPath, width, height, maxVal } = useMemo(() => {
          if (!data || data.length === 0) return { points: [], path: "", areaPath: "", width: 0, height: 0, maxVal: 0 }

          const max = Math.max(...data.map(d => d.value)) || 100
          const w = 1000
          const h = 300

          const pts = data.map((d, i) => {
               const x = (i / (data.length - 1)) * w
               const y = h - (d.value / max) * h * 0.8 // Use 80% height max to leave headroom
               return { x, y, ...d }
          })

          const linePath = `M ${pts.map(p => `${p.x},${p.y}`).join(" L ")}`
          const fillPath = `M ${pts[0].x},${h} L ${pts.map(p => `${p.x},${p.y}`).join(" L ")} L ${w},${h} Z`

          return { points: pts, path: linePath, areaPath: fillPath, width: w, height: h, maxVal: max }
     }, [data])

     const handleMouseMove = (e: React.MouseEvent) => {
          if (!containerRef.current || !data.length) return

          const rect = containerRef.current.getBoundingClientRect()
          const x = e.clientX - rect.left
          const relativeX = (x / rect.width) * width // Scale to SVG width

          // Find nearest point
          const index = Math.round((relativeX / width) * (data.length - 1))
          const point = points[Math.min(Math.max(index, 0), points.length - 1)]

          setHoveredData(point)
          // Set tooltip position relative to client for fixed positioning or relative to container
          setTooltipPos({ x: (point.x / width) * rect.width, y: (point.y / height) * rect.height })
     }

     const handleMouseLeave = () => setHoveredData(null)

     return (
          <div className="bg-white p-6 rounded-2xl border border-stone-100 shadow-sm h-full flex flex-col">
               <div className="flex justify-between items-center mb-6">
                    <div>
                         <h3 className="font-serif text-lg text-stone-900">Revenue Trend</h3>
                         <p className="text-xs text-stone-400">Sales over selected period</p>
                    </div>
                    <div className="p-2 bg-stone-50 rounded-lg text-stone-400">
                         <BarChart3 size={18} />
                    </div>
               </div>

               {/* Chart Container */}
               <div
                    ref={containerRef}
                    className="flex-1 w-full relative min-h-[200px] overflow-hidden cursor-crosshair"
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
               >
                    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible" preserveAspectRatio="none">
                         <defs>
                              <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                                   <stop offset="0%" stopColor="#1c1917" stopOpacity="0.1" />
                                   <stop offset="100%" stopColor="#1c1917" stopOpacity="0" />
                              </linearGradient>
                         </defs>

                         {/* Area Fill */}
                         <path d={areaPath} fill="url(#chartGradient)" />

                         {/* Stroke Line */}
                         <path d={path} fill="none" stroke="#1c1917" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

                         {/* Active Dot */}
                         {hoveredData && (
                              <circle
                                   cx={(points.find(p => p.date === hoveredData.date)?.x)}
                                   cy={(points.find(p => p.date === hoveredData.date)?.y)}
                                   r="6"
                                   fill="#1c1917"
                                   stroke="white"
                                   strokeWidth="3"
                              />
                         )}
                    </svg>

                    {/* Floating Tooltip */}
                    {hoveredData && (
                         <div
                              className="absolute bg-stone-900 text-white p-3 rounded-xl shadow-xl pointer-events-none z-10 transition-all duration-75 ease-out"
                              style={{
                                   left: tooltipPos.x,
                                   top: Math.max(0, tooltipPos.y - 80), // Keep above cursor
                                   transform: 'translateX(-50%)'
                              }}
                         >
                              <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-0.5">
                                   {format(new Date(hoveredData.date), "MMM d, yyyy")}
                              </p>
                              <p className="text-lg font-serif font-medium">
                                   €{hoveredData.value.toFixed(2)}
                              </p>
                              {/* Small arrow */}
                              <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-stone-900" />
                         </div>
                    )}

                    {/* X-Axis Labels (Simple) */}
                    <div className="absolute inset-x-0 bottom-0 flex justify-between px-2 text-[9px] font-bold text-stone-300 pointer-events-none">
                         <span>{data?.[0] && format(new Date(data[0].date), "MMM d")}</span>
                         <span>{data?.[data.length - 1] && format(new Date(data[data.length - 1].date), "MMM d")}</span>
                    </div>
               </div>
          </div>
     )
}

export default DashboardChart
