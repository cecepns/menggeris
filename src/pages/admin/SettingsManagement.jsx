import { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import { settingsAPI } from '../../utils/api';

const SettingsManagement = () => {
  const [settings, setSettings] = useState({
    company_name: 'Menggeris',
    address: '',
    warehouse_address: 'Jl.M.T Haryono No.50, RT.01, Desa Loh Sumber, Kec. Loa Kulu, Kutai Kartanegara75571',
    phone: '',
    email: '',
    about: '',
    maps: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await settingsAPI.get();
      if (response.data) {
        setSettings({ ...settings, ...response.data });
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await settingsAPI.update(settings);
      alert('Settings updated successfully');
    } catch (error) {
      console.error('Error updating settings:', error);
      alert('Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    setSettings({
      ...settings,
      [e.target.name]: e.target.value
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-wood-maroon"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Settings Management</h1>
        <p className="text-gray-600">Manage your company information and contact details</p>
      </div>

      <div className="bg-white shadow rounded-lg">
        <form onSubmit={handleSubmit} className="space-y-6 p-6">
          {/* Company Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Company Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="company_name" className="block text-sm font-medium text-gray-700 mb-2">
                  Company Name
                </label>
                <input
                  type="text"
                  id="company_name"
                  name="company_name"
                  value={settings.company_name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wood-maroon focus:border-transparent"
                  placeholder="Enter company name"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  value={settings.phone}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wood-maroon focus:border-transparent"
                  placeholder="Enter phone number"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={settings.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wood-maroon focus:border-transparent"
                  placeholder="Enter email address"
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                  Office Address
                </label>
                <textarea
                  id="address"
                  name="address"
                  rows={3}
                  value={settings.address}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wood-maroon focus:border-transparent"
                  placeholder="Enter office address"
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="warehouse_address" className="block text-sm font-medium text-gray-700 mb-2">
                  Warehouse Address
                </label>
                <textarea
                  id="warehouse_address"
                  name="warehouse_address"
                  rows={3}
                  value={settings.warehouse_address}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wood-maroon focus:border-transparent"
                  placeholder="Enter warehouse address"
                />
              </div>
            </div>
          </div>

          {/* About Us */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">About Us</h3>
            <div>
              <label htmlFor="about" className="block text-sm font-medium text-gray-700 mb-2">
                About Description
              </label>
              <textarea
                id="about"
                name="about"
                rows={6}
                value={settings.about}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wood-maroon focus:border-transparent"
                placeholder="Enter about us description"
              />
            </div>
          </div>

          {/* Google Maps */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Location</h3>
            <div>
              <label htmlFor="maps" className="block text-sm font-medium text-gray-700 mb-2">
                Google Maps Embed Code
              </label>
              <textarea
                id="maps"
                name="maps"
                rows={4}
                value={settings.maps}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wood-maroon focus:border-transparent"
                placeholder="Paste Google Maps embed iframe code here"
              />
              <p className="mt-2 text-sm text-gray-500">
                Go to Google Maps, search for your location, click "Share" → "Embed a map", and paste the iframe code here.
              </p>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end pt-6 border-t border-gray-200">
            <button
              type="submit"
              disabled={saving}
              className="bg-wood-dark text-white px-6 py-2 rounded-lg hover:bg-wood-dark transition-colors flex items-center disabled:opacity-50"
            >
              {saving && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>}
              <Save className="h-5 w-5 mr-2" />
              Save Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SettingsManagement;