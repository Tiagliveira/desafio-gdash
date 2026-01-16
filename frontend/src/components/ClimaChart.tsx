import {
    ComposedChart,
    Line,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Cell,
    Brush
} from "recharts";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const getTempColor = (temp: number) => {
    if (temp >= 30) return "#f97316";
    if (temp >= 25) return "#eab308";
    if (temp >= 15) return "#22c55e";
    if (temp >= 8) return "#38bdf8";
    return "#1e3a8a";
};

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        const tempValue = payload.find((p: any) => p.dataKey === 'temperatura')?.value;
        const tempColor = getTempColor(tempValue);

        return (
            <div className="bg-slate-950 border border-slate-800 p-3 rounded-lg shadow-xl text-white text-xs z-50">
                <p className="font-bold mb-2 text-slate-300">
                    {label ? format(new Date(label), "dd 'de' MMM, HH:mm", { locale: ptBR }) : ''}
                </p>

                {payload.map((entry: any, index: number) => (
                    <div key={index} className="flex items-center gap-2 mb-1">
                        <span style={{ color: entry.dataKey === 'temperatura' ? tempColor : entry.color, fontSize: '18px', lineHeight: 0 }}>
                            ●
                        </span>
                        <span className="capitalize text-slate-300">{entry.name}:</span>
                        <span className="font-mono font-bold text-white">
                            {entry.value} {entry.unit}
                        </span>
                    </div>
                ))}
            </div>
        );
    }
    return null;
};

interface ClimateChartProps {
    data: any[];
}

export function ClimateChart({ data }: ClimateChartProps) {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data} margin={{ top: 20, right: 0, bottom: 0, left: -20 }}>
                <defs>
                    <linearGradient id="tempLegend" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#38bdf8" />   {/* Azul (Frio) */}
                        <stop offset="50%" stopColor="#22c55e" />  {/* Verde (Médio) */}
                        <stop offset="100%" stopColor="#f97316" /> {/* Laranja (Quente) */}
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} vertical={false} />

                <XAxis
                    dataKey="createdAt"
                    tickFormatter={(tick) => format(new Date(tick), "HH:mm")}
                    stroke="#94a3b8"
                    tick={{ fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    minTickGap={30}
                />

                <YAxis
                    yAxisId="left"
                    stroke="#94a3b8"
                    unit="°C"
                    tick={{ fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    domain={['auto', 'auto']}
                />

                <YAxis
                    yAxisId="right"
                    orientation="right"
                    stroke="#94a3b8"
                    unit="%"
                    tick={{ fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                />

                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.05)' }} />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />

                <Bar
                    yAxisId="left"
                    dataKey="temperatura"
                    name="Temperatura"
                    barSize={20}
                    radius={[4, 4, 0, 0]}
                    unit="°C"
                    fill="url(#tempLegend)"
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={getTempColor(entry.temperatura)} />
                    ))}
                </Bar>

                <Line yAxisId="right" type="monotone" dataKey="umidade" name="Umidade" stroke="#3b82f6" strokeWidth={3} dot={false} unit="%" />
                <Line yAxisId="left" type="monotone" dataKey="velocidade_vento" name="Vento" stroke="#10b981" strokeWidth={3} dot={false} unit=" km/h" />
                <Line yAxisId="right" type="monotone" dataKey="probabilidade_chuva" name="Chuva" stroke="#8b5cf6" strokeDasharray="4 4" strokeWidth={3} dot={false} unit="%" />

                <Brush
                    dataKey="createdAt"
                    height={20}
                    fill="#f1f5f9"
                    stroke="#64748b"
                    travellerWidth={15}
                    tickFormatter={(tick) => format(new Date(tick), "dd/MM")}
                    startIndex={data.length - 24}
                    endIndex={data.length - 1}
                />
            </ComposedChart>
        </ResponsiveContainer>
    );
}