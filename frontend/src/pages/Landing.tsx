import { Link } from 'react-router-dom';
import { Brain, Zap, Shield, ArrowRight } from 'lucide-react';

export function Landing() {
  return (
    <div className="space-y-20">
      {/* Hero Section */}
      <div className="bg-yellow-400 border-4 border-black rounded-lg p-12 shadow-brutal">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-6xl font-black text-black mb-6">
            Content Analysis with AI Precision
          </h1>
          <p className="text-xl font-bold text-black mb-8">
            Automatically categorize and analyze your content using advanced AI technology
          </p>
          <Link
            to="/upload"
            className="inline-flex items-center px-8 py-4 bg-black text-white rounded-lg 
              font-bold text-lg hover:-translate-y-1 hover:shadow-brutal transition-transform"
          >
            Get Started <ArrowRight className="ml-2" />
          </Link>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <FeatureCard
          icon={<Brain className="w-8 h-8" />}
          title="Smart Analysis"
          description="Advanced AI algorithms categorize your content with high precision"
          color="bg-blue-400"
        />
        <FeatureCard
          icon={<Zap className="w-8 h-8" />}
          title="Real-time Processing"
          description="Get instant results and insights about your content"
          color="bg-pink-400"
        />
        <FeatureCard
          icon={<Shield className="w-8 h-8" />}
          title="Secure & Private"
          description="Your content is processed securely and never stored without permission"
          color="bg-green-400"
        />
      </div>
    </div>
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}

function FeatureCard({ icon, title, description, color }: FeatureCardProps) {
  return (
    <div className={`${color} p-6 rounded-lg border-4 border-black shadow-brutal 
      hover:-translate-y-1 transition-transform`}>
      <div className="text-black mb-4">{icon}</div>
      <h3 className="text-xl font-bold text-black mb-2">{title}</h3>
      <p className="text-black font-medium">{description}</p>
    </div>
  );
} 