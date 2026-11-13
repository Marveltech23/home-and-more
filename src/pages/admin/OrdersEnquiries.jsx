import { useState } from 'react';
import {
  Search,
  Filter,
  ShoppingBag,
  Clock,
  CheckCircle2,
  Phone,
  Mail,
  User,
  MessageSquare,
  FileText,
  Trash2,
  X,
  ExternalLink
} from 'lucide-react';
import Badge from '../../components/common/Badge';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { WhatsAppIcon } from '../../components/common/BrandIcons';
import { useStore } from '../../context/StoreContext';
import { formatNaira } from '../../utils/format';
import { buildWhatsAppLink } from '../../utils/whatsapp';

export default function OrdersEnquiries() {
  const { enquiries, updateEnquiryStatus, deleteEnquiry } = useStore();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);

  // Drawer Edit Form
  const [drawerStatus, setDrawerStatus] = useState('pending');
  const [drawerNotes, setDrawerNotes] = useState('');

  // Delete State
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, id: null, name: '' });

  const handleSelectEnquiry = (enquiry) => {
    setSelectedEnquiry(enquiry);
    setDrawerStatus(enquiry.status || 'pending');
    setDrawerNotes(enquiry.notes || '');
  };

  const handleSaveDrawerStatus = (e) => {
    e.preventDefault();
    if (selectedEnquiry) {
      updateEnquiryStatus(selectedEnquiry.id, drawerStatus, drawerNotes);
      setSelectedEnquiry((prev) => ({
        ...prev,
        status: drawerStatus,
        notes: drawerNotes,
      }));
    }
  };

  const handleDeleteConfirm = () => {
    if (deleteDialog.id) {
      deleteEnquiry(deleteDialog.id);
      if (selectedEnquiry?.id === deleteDialog.id) {
        setSelectedMedia(null);
      }
      setDeleteDialog({ isOpen: false, id: null, name: '' });
    }
  };

  const filteredEnquiries = enquiries.filter((e) => {
    if (statusFilter !== 'all' && e.status !== statusFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        e.customerName.toLowerCase().includes(q) ||
        e.phone.includes(q) ||
        e.productName?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const statusVariantMap = {
    pending: 'warning',
    contacted: 'brand',
    completed: 'published',
    cancelled: 'danger',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#24150F] tracking-tight">
            Orders &amp; Enquiries
          </h1>
          <p className="text-xs sm:text-sm text-[#82746B] mt-0.5">
            Manage incoming furniture customer WhatsApp enquiries, requests, and order statuses.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-[#F36B0A] bg-[#FFF3EA] px-3.5 py-1.5 rounded-full border border-[#F36B0A]/30">
            {enquiries.filter((e) => e.status === 'pending').length} Pending
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="card p-4 bg-white flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#82746B]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by customer name, phone, or product..."
            className="w-full pl-9 pr-4 py-2 rounded-full border border-[#F0DFD1] text-xs sm:text-sm focus:outline-none focus:border-[#F36B0A]"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-auto px-4 py-2 rounded-full border border-[#F0DFD1] text-xs font-semibold text-[#24150F] bg-white focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="contacted">Contacted</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <span className="text-xs font-semibold text-[#82746B] whitespace-nowrap">
            {filteredEnquiries.length} total
          </span>
        </div>
      </div>

      {/* Main Table & Details Drawer Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Table */}
        <div className={selectedEnquiry ? 'lg:col-span-7' : 'lg:col-span-12'}>
          <div className="card overflow-hidden bg-white border border-[#F0DFD1]">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-[#FFFAF5] border-b border-[#F0DFD1] text-[11px] font-bold uppercase tracking-wider text-[#82746B]">
                  <tr>
                    <th className="py-3.5 px-4">Customer</th>
                    <th className="py-3.5 px-4">Product / Topic</th>
                    <th className="py-3.5 px-4">Amount</th>
                    <th className="py-3.5 px-4">Date</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0DFD1]">
                  {filteredEnquiries.map((e) => {
                    const isSelected = selectedEnquiry?.id === e.id;
                    return (
                      <tr
                        key={e.id}
                        onClick={() => handleSelectEnquiry(e)}
                        className={`cursor-pointer transition-colors ${
                          isSelected ? 'bg-[#FFF3EA]/70' : 'hover:bg-[#FFFAF5]/60'
                        }`}
                      >
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-[#24150F]">{e.customerName}</div>
                          <span className="text-[11px] text-[#82746B]">{e.phone}</span>
                        </td>

                        <td className="py-3.5 px-4 font-semibold text-[#24150F] max-w-[150px] truncate">
                          {e.productName}
                        </td>

                        <td className="py-3.5 px-4 font-bold text-[#F36B0A]">
                          {e.price ? formatNaira(e.price) : 'Enquiry'}
                        </td>

                        <td className="py-3.5 px-4 text-xs text-[#82746B] whitespace-nowrap">
                          {e.date}
                        </td>

                        <td className="py-3.5 px-4">
                          <Badge variant={statusVariantMap[e.status] || 'default'}>
                            {e.status}
                          </Badge>
                        </td>

                        <td className="py-3.5 px-4 text-right" onClick={(ev) => ev.stopPropagation()}>
                          <button
                            type="button"
                            onClick={() => setDeleteDialog({ isOpen: true, id: e.id, name: e.customerName })}
                            className="p-1.5 rounded-lg text-[#82746B] hover:text-rose-600 hover:bg-rose-50"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Slide-over Enquiry Details Drawer */}
        {selectedEnquiry && (
          <aside className="lg:col-span-5 card p-6 bg-white border border-[#F0DFD1] space-y-5 h-fit sticky top-24">
            <div className="flex items-center justify-between pb-3 border-b border-[#F0DFD1]">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-[#F36B0A]" />
                <h3 className="font-bold text-base text-[#24150F]">Enquiry Details</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedEnquiry(null)}
                className="text-[#82746B] hover:text-[#24150F] p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Customer Contact Block */}
            <div className="p-4 rounded-2xl bg-[#FFFAF5] border border-[#F0DFD1] space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-[#24150F]">{selectedEnquiry.customerName}</span>
                <Badge variant={statusVariantMap[selectedEnquiry.status] || 'default'}>
                  {selectedEnquiry.status}
                </Badge>
              </div>

              <div className="flex items-center gap-2 text-[#82746B]">
                <Phone className="w-3.5 h-3.5 text-[#F36B0A]" />
                <a href={`tel:${selectedEnquiry.phone}`} className="hover:underline">
                  {selectedEnquiry.phone}
                </a>
              </div>

              {selectedEnquiry.email && selectedEnquiry.email !== 'Not provided' && (
                <div className="flex items-center gap-2 text-[#82746B]">
                  <Mail className="w-3.5 h-3.5 text-[#F36B0A]" />
                  <span>{selectedEnquiry.email}</span>
                </div>
              )}

              {/* Direct Actions */}
              <div className="pt-2 flex items-center gap-2">
                <a
                  href={buildWhatsAppLink(selectedEnquiry.phone, `Hello ${selectedEnquiry.customerName}, this is Home & More Furniture regarding your enquiry on ${selectedEnquiry.productName}.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 btn-whatsapp text-xs py-2 px-3 justify-center"
                >
                  <WhatsAppIcon className="w-3.5 h-3.5 fill-white" />
                  <span>WhatsApp Customer</span>
                </a>
              </div>
            </div>

            {/* Product & Message Details */}
            <div className="space-y-3 text-xs">
              <div>
                <span className="text-[#82746B] font-semibold">Product Requested:</span>
                <p className="font-bold text-sm text-[#24150F] mt-0.5">{selectedEnquiry.productName}</p>
                {selectedEnquiry.price > 0 && (
                  <p className="font-bold text-[#F36B0A] mt-0.5">{formatNaira(selectedEnquiry.price)}</p>
                )}
              </div>

              <div>
                <span className="text-[#82746B] font-semibold">Customer Message:</span>
                <p className="p-3 rounded-xl bg-stone-50 border border-stone-200 text-[#24150F] mt-1 italic">
                  "{selectedEnquiry.message || 'Customer requested direct callback.'}"
                </p>
              </div>

              <div className="text-[11px] text-[#82746B]">
                Received on: {selectedEnquiry.date}
              </div>
            </div>

            {/* Update Status & Notes Form */}
            <form onSubmit={handleSaveDrawerStatus} className="pt-4 border-t border-[#F0DFD1] space-y-3">
              <div>
                <label className="block text-xs font-bold uppercase text-[#24150F] mb-1">
                  Update Enquiry Status
                </label>
                <select
                  value={drawerStatus}
                  onChange={(e) => setDrawerStatus(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#F0DFD1] text-xs font-semibold text-[#24150F] bg-white focus:outline-none focus:border-[#F36B0A]"
                >
                  <option value="pending">Pending</option>
                  <option value="contacted">Contacted</option>
                  <option value="completed">Completed / Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-[#24150F] mb-1">
                  Internal Staff Notes
                </label>
                <textarea
                  rows={3}
                  value={drawerNotes}
                  onChange={(e) => setDrawerNotes(e.target.value)}
                  placeholder="e.g. Sent proforma invoice on WhatsApp, delivery booked for Saturday..."
                  className="w-full px-3 py-2 rounded-xl border border-[#F0DFD1] text-xs focus:outline-none focus:border-[#F36B0A]"
                />
              </div>

              <button type="submit" className="w-full btn-primary text-xs py-2.5">
                Save Status &amp; Notes
              </button>
            </form>
          </aside>
        )}
      </div>

      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ isOpen: false, id: null, name: '' })}
        onConfirm={handleDeleteConfirm}
        title={`Delete enquiry from ${deleteDialog.name}?`}
        message="This enquiry record will be permanently deleted from the admin log."
      />
    </div>
  );
}
