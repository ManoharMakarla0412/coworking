interface PricingFeature {
    text: string;
  }
  
  interface PricingCardProps {
    title: string;
    price: string;
    subtitle: string;
    features: PricingFeature[];
    onSelect: () => void;
    isSelected?: boolean;
  }
  
  export function PricingCard({
    title,
    price,
    subtitle,
    features,
    onSelect,
    isSelected
  }: PricingCardProps) {
    return (
      <div className={`flex flex-col rounded-lg ${isSelected ? 'ring-2 ring-purple-500' : ''}`}>
        <div className="bg-purple-600 p-6 rounded-t-lg">
          <h3 className="text-2xl font-semibold text-white text-center">{title}</h3>
          <p className="text-white/80 text-center text-sm">{subtitle}</p>
        </div>
        <div className="p-6 space-y-6 bg-[#141414] rounded-b-lg flex-1">
          <div className="text-center">
            <span className="text-2xl font-light text-white">₹</span>
            <span className="text-5xl font-bold text-white">{price}</span>
            <span className="text-gray-400 ml-2">{title.toLowerCase()}</span>
          </div>
          <div className="space-y-4">
            {features.map((feature, index) => (
              <div key={index} className="text-gray-300 text-center">{feature.text}</div>
            ))}
          </div>
          <button
            onClick={onSelect}
            className="w-full py-2 px-4 bg-white text-black rounded-lg hover:bg-gray-100 transition-colors"
          >
            Select Plan
          </button>
        </div>
      </div>
    );
  }
  
  