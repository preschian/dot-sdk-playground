import { useState, useEffect } from "react";
import "./App.css";
import { getData } from "./sdk";

interface ChainData {
  name: string;
  freeBalance: number;
  nfts: number;
}

interface NetworkData {
  chain: string;
  data: ChainData | null;
  loading: boolean;
  error: string | null;
}

function App() {
  const [address, setAddress] = useState<string>("");
  const [networks, setNetworks] = useState<NetworkData[]>([
    { chain: "polkadot", data: null, loading: true, error: null },
    { chain: "kusama", data: null, loading: true, error: null },
    { chain: "paseo", data: null, loading: true, error: null },
    { chain: "westend", data: null, loading: true, error: null },
  ]);

  const fetchAllData = async (customAddress?: string) => {
    const chains = ["polkadot", "kusama", "paseo", "westend"];
    
    // Reset loading states
    setNetworks(prev => prev.map(network => ({ ...network, loading: true, error: null })));
    
    const promises = chains.map(async (chain) => {
      try {
        const data = await getData(chain, customAddress);
        return { chain, data, loading: false, error: null };
      } catch (err) {
        return { 
          chain, 
          data: null, 
          loading: false, 
          error: err instanceof Error ? err.message : "An error occurred" 
        };
      }
    });

    const results = await Promise.all(promises);
    setNetworks(results);
  };

  useEffect(() => {
    fetchAllData(address);
  }, [address]);

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress(e.target.value);
  };

  const getChainBadgeColor = (chain: string) => {
    switch (chain) {
      case "polkadot": return "bg-pink-50 text-pink-700 border-pink-200";
      case "kusama": return "bg-gray-50 text-gray-700 border-gray-200";
      case "paseo": return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "westend": return "bg-blue-50 text-blue-700 border-blue-200";
      default: return "bg-blue-50 text-blue-700 border-blue-200";
    }
  };

  const getTokenSymbol = (chain: string) => {
    switch (chain) {
      case "polkadot": return "DOT";
      case "kusama": return "KSM";
      case "paseo": return "PAS";
      case "westend": return "WND";
      default: return "TOKEN";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Polkadot Portfolio
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Track your assets across multiple Polkadot ecosystem networks
          </p>
          
          {/* Address Input */}
          <div className="max-w-md mx-auto">
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
              Account Address
            </label>
            <input
              type="text"
              id="address"
              value={address}
              onChange={handleAddressChange}
              placeholder="Enter address (leave empty for default)"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
            <p className="text-xs text-gray-500 mt-2">
              Leave empty to use the default address
            </p>
          </div>
        </div>

        {/* Networks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {networks.map((network) => (
            <div 
              key={network.chain} 
              className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-200"
            >
              {/* Network Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${network.chain === 'polkadot' ? 'bg-pink-500' : network.chain === 'kusama' ? 'bg-gray-800' : 'bg-emerald-500'}`} />
                  <h2 className="text-xl font-semibold text-gray-900 capitalize">
                    {network.chain}
                  </h2>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getChainBadgeColor(network.chain)}`}>
                  {network.loading ? "Loading" : network.error ? "Error" : "Live"}
                </span>
              </div>

              {/* Network Content */}
              <div className="space-y-4">
                {network.loading && (
                  <div className="flex items-center justify-center py-12">
                    <div className="w-8 h-8 border-2 border-gray-200 border-t-gray-600 rounded-full animate-spin" />
                  </div>
                )}

                {network.error && (
                  <div className="text-center py-12">
                    <div className="text-red-500 text-sm">
                      Connection failed
                    </div>
                  </div>
                )}

                {network.data && !network.loading && (
                  <div className="space-y-4">
                    {/* Account */}
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                        Account
                      </div>
                      <div className="text-sm font-mono text-gray-800 truncate">
                        {network.data.name}
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4">
                      {/* Balance */}
                      <div className="p-4 border border-gray-200 rounded-lg">
                        <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                          Balance
                        </div>
                        <div className="text-lg font-semibold text-gray-900">
                          {network.data.freeBalance.toFixed(4)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {getTokenSymbol(network.chain)}
                        </div>
                      </div>

                      {/* NFTs */}
                      <div className="p-4 border border-gray-200 rounded-lg">
                        <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                          NFTs
                        </div>
                        <div className="text-lg font-semibold text-gray-900">
                          {network.data.nfts}
                        </div>
                        <div className="text-xs text-gray-500">
                          Items
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center mt-16 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Powered by Papi
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
