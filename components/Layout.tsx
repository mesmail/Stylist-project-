
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'analyze', icon: 'fa-camera', label: 'Analysis' },
    { id: 'history', icon: 'fa-history', label: 'History' },
    { id: 'outfits', icon: 'fa-vest', label: 'Outfits' },
    { id: 'chat', icon: 'fa-comments', label: 'Stylist Chat' },
    { id: 'generate', icon: 'fa-wand-magic-sparkles', label: 'Imagine' },
    { id: 'trends', icon: 'fa-chart-line', label: 'Trends' },
    { id: 'live', icon: 'fa-microphone', label: 'Live Session' },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-zinc-50">
      {/* Sidebar */}
      <aside className="w-20 md:w-64 flex-shrink-0 border-r border-zinc-200 glass-panel flex flex-col z-10">
        <div className="p-6">
          <h1 className="text-2xl font-bold tracking-tight text-black flex items-center">
            <span className="bg-black text-white w-8 h-8 rounded flex items-center justify-center mr-2">V</span>
            <span className="hidden md:inline">VogueAI</span>
          </h1>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 py-4">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center p-3 rounded-xl transition-all ${
                activeTab === item.id 
                  ? 'bg-black text-white shadow-lg' 
                  : 'text-zinc-500 hover:bg-zinc-100'
              }`}
            >
              <i className={`fas ${item.icon} text-lg md:mr-3 w-6 text-center`}></i>
              <span className="hidden md:inline font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-zinc-200">
          <div className="bg-gradient-to-br from-zinc-800 to-black p-4 rounded-2xl text-white hidden md:block">
            <p className="text-xs font-semibold uppercase tracking-wider opacity-70 mb-1">Status</p>
            <p className="text-sm">Pro Membership Active</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative bg-white md:m-4 md:rounded-3xl md:shadow-inner border border-zinc-100">
        <header className="sticky top-0 z-20 glass-panel border-b border-zinc-100 p-6 flex justify-between items-center">
          <h2 className="text-xl font-semibold capitalize">{activeTab} Fashion</h2>
          <div className="flex items-center space-x-4">
             <button className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-600 hover:bg-zinc-200">
                <i className="fas fa-bell"></i>
             </button>
             <div className="w-10 h-10 rounded-full bg-black overflow-hidden border-2 border-zinc-200">
                <img src="https://picsum.photos/seed/user/100/100" alt="Avatar" />
             </div>
          </div>
        </header>
        <div className="p-6 md:p-10 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
