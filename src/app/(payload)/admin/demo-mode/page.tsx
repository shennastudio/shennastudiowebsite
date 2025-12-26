import DemoModeToggle from '../components/DemoModeToggle'

export const metadata = {
  title: 'Demo Mode | ShennaStudio Admin',
  description: 'Manage demo products and prepare store for production',
}

export default function DemoModePage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🌊 Demo Mode Management
          </h1>
          <p className="text-gray-600">
            Manage demonstration products and prepare your store for production.
          </p>
        </div>

        <DemoModeToggle />

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center gap-2">
            <span>ℹ️</span>
            How to Use Demo Mode
          </h3>
          <div className="space-y-3 text-sm text-blue-800">
            <div>
              <strong>1. Development & Testing:</strong>
              <p>Click "Create Demo Products" to populate your store with 6 ocean-themed bracelets featuring realistic images, pricing, and variants.</p>
            </div>
            <div>
              <strong>2. Preview Your Store:</strong>
              <p>Navigate to the homepage to see how products appear to customers. Test the shopping cart, product details, and checkout flow.</p>
            </div>
            <div>
              <strong>3. Production Ready:</strong>
              <p>When you're ready to launch, click "Clear All Demo Data" to remove all demo products and switch to production mode.</p>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-yellow-900 mb-2 flex items-center gap-2">
            <span>⚠️</span>
            Important Notes
          </h3>
          <ul className="space-y-2 text-sm text-yellow-800 list-disc list-inside">
            <li>Demo products use Unsplash images - these are for preview only</li>
            <li>Clearing demo data is permanent and cannot be undone</li>
            <li>Demo products are clearly tagged with "DEMO-" SKU prefix</li>
            <li>You can recreate demo data anytime during development</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
