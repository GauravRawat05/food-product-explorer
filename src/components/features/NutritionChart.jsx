import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip, Legend } from 'recharts';

export function NutritionChart({ nutriments }) {
    if (!nutriments) return null;

    const data = [
        { subject: 'Fat', A: nutriments.fat_100g || 0, fullMark: 100 },
        { subject: 'Saturated Fat', A: nutriments['saturated-fat_100g'] || 0, fullMark: 100 },
        { subject: 'Sugars', A: nutriments.sugars_100g || 0, fullMark: 100 },
        { subject: 'Salt', A: nutriments.salt_100g || 0, fullMark: 100 },
        { subject: 'Proteins', A: nutriments.proteins_100g || 0, fullMark: 100 },
        { subject: 'Carbs', A: nutriments.carbohydrates_100g || 0, fullMark: 100 },
    ];

    return (
        <div className="w-full h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
                    <PolarGrid stroke="#e5e7eb" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: 'currentColor', fontSize: 12 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar
                        name="gram per 100g"
                        dataKey="A"
                        stroke="var(--color-primary)"
                        strokeWidth={3}
                        fill="var(--color-primary)"
                        fillOpacity={0.4}
                    />
                    <Tooltip
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                </RadarChart>
            </ResponsiveContainer>
        </div>
    );
}
