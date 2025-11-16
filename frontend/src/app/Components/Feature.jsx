// feaure component
const features = [
    {
      icon: "/icons/Graph_icon.svg",
      title: "Interactive Visual Charts",
      description: "Create stunning bar charts, line graphs, and area charts with real-time data updates. Customize colors, animations, and styling to match your brand."
    },
    {
      icon: "/icons/dashboard_icon.svg",
      title: "Advanced Analytics Dashboard",
      description: "Comprehensive pie charts and donut charts with drill-down capabilities. Analyze spending patterns and budget allocation with precision."
    },
    {
      icon: "/icons/category_icon.svg",
      title: "Secure & Private",
      description: "Your data stays safe. All your financial information is securely stored and never shared. Powered by trusted authentication and modern web practices to ensure your privacy at every step."
    }
  ]

const FeatureCard = ({icon,title,description})=>(
    <div className="flex flex-col p-6  rounded-2xl shadow-lg hover:scale-[1.05] hover:shadow-2xl transition-transform duration-300 max-w-sm bg-white/90 backdrop-blur-md border border-white/30">
      <img src={icon} alt={title} className="w-16 h-16 mb-4" />
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
)

export default function FeatureCards() {
  return (
       <div className="grid gap-10 sm:grid-cols-1 md:grid-cols-3 justify-items-center">
      {features.map((feature, index) => (
        <FeatureCard key={index} {...feature} />
      ))}
    </div>
  );
}