import React, { useState } from 'react';
import { useAuth, SavedRangoliItem, SavedECardItem } from '../context/AuthContext';
import { 
  X, 
  User as UserIcon, 
  LogOut, 
  LogIn, 
  Sparkles, 
  Palette, 
  Mail, 
  Trash2, 
  ExternalLink, 
  Clock, 
  Check, 
  Layers 
} from 'lucide-react';
import { sound } from '../utils/audio';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoadRangoli?: (rangoli: SavedRangoliItem) => void;
  onViewECard?: (card: SavedECardItem) => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  onLoadRangoli,
  onViewECard,
}) => {
  const { user, loading, signInWithGoogle, signOutUser, savedRangolis, savedECards, deleteRangoli, deleteECard } = useAuth();
  const [activeTab, setActiveTab] = useState<'rangolis' | 'ecards'>('rangolis');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isSigningIn, setIsSigningIn] = useState(false);

  if (!isOpen) return null;

  const handleSignIn = async () => {
    try {
      setAuthError(null);
      setIsSigningIn(true);
      await signInWithGoogle();
      sound.playTempleBell();
    } catch (err: any) {
      setAuthError(err?.message || 'Sign in was cancelled or failed.');
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOutUser();
      sound.playDiyaLight();
    } catch (err: any) {
      console.error(err);
    }
  };

  const handleDeleteRangoli = async (id: string) => {
    try {
      setDeletingId(id);
      await deleteRangoli(id);
    } catch (err) {
      console.error(err);
    } finally {
      setDeletingId(null);
    }
  };

  const handleDeleteECard = async (id: string) => {
    try {
      setDeletingId(id);
      await deleteECard(id);
    } catch (err) {
      console.error(err);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#080B1A]/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-2xl bg-[#0F142A] border border-[#DDAA42]/40 rounded-3xl p-6 md:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(255,140,36,0.2)] max-h-[90vh] flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-labelledby="profile-modal-title"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full border border-white/10 text-[#D6BD8B] hover:text-white hover:bg-white/5 transition"
          aria-label="Close profile modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-4 pb-6 border-b border-white/10">
          {user ? (
            <div className="relative">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || 'User'}
                  className="w-14 h-14 rounded-full border-2 border-[#FFC857] object-cover shadow-md"
                />
              ) : (
                <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#FF8C24] to-[#FFC857] flex items-center justify-center text-[#080B1A] font-bold text-xl font-cinzel">
                  {user.displayName?.charAt(0) || user.email?.charAt(0) || 'U'}
                </div>
              )}
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#168B78] border-2 border-[#0F142A] flex items-center justify-center" title="Verified Account">
                <Check className="w-3 h-3 text-white" />
              </div>
            </div>
          ) : (
            <div className="w-14 h-14 rounded-full bg-[#151A33] border border-[#DDAA42]/30 flex items-center justify-center text-[#FFC857]">
              <UserIcon className="w-7 h-7" />
            </div>
          )}

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h2 id="profile-modal-title" className="text-xl md:text-2xl font-playfair font-bold text-white truncate">
                {user ? user.displayName || 'Devotee Account' : 'Diwali Personal Profile'}
              </h2>
            </div>
            <p className="text-xs text-[#D6BD8B]/80 truncate">
              {user ? user.email : 'Sign in to save and access your Rangolis & E-Cards anywhere.'}
            </p>
          </div>

          {user && (
            <button
              onClick={handleSignOut}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-red-500/30 text-xs text-red-300 hover:bg-red-500/10 transition"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline font-cinzel">Sign Out</span>
            </button>
          )}
        </div>

        {/* Auth Required State */}
        {!user && (
          <div className="py-10 text-center flex flex-col items-center justify-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#FF8C24]/15 border border-[#FFC857]/40 flex items-center justify-center text-[#FFC857] animate-pulse">
              <Sparkles className="w-8 h-8" />
            </div>
            <div className="max-w-md space-y-2">
              <h3 className="text-lg font-playfair font-bold text-white">
                Preserve Your Festive Creations
              </h3>
              <p className="text-xs text-[#D6BD8B]/80 leading-relaxed">
                Connect your account with Google Authentication to securely store your intricate Rangoli artwork and heartfelt Diwali greeting cards in the cloud.
              </p>
            </div>

            {authError && (
              <p className="text-xs text-red-400 bg-red-950/30 border border-red-800/40 px-4 py-2 rounded-xl">
                {authError}
              </p>
            )}

            <button
              onClick={handleSignIn}
              disabled={isSigningIn}
              className="mt-2 py-3 px-6 rounded-full bg-gradient-to-r from-[#FF8C24] to-[#DDAA42] text-[#080B1A] font-bold font-cinzel text-xs flex items-center gap-2 hover:opacity-95 transition shadow-[0_0_20px_rgba(255,140,36,0.4)] disabled:opacity-50"
            >
              <LogIn className="w-4 h-4" />
              <span>{isSigningIn ? 'Connecting...' : 'Sign In with Google'}</span>
            </button>
          </div>
        )}

        {/* Authenticated User Content */}
        {user && (
          <div className="flex-1 flex flex-col overflow-hidden pt-4">
            {/* Tab switchers */}
            <div className="flex border-b border-white/10 mb-4">
              <button
                onClick={() => setActiveTab('rangolis')}
                className={`flex-1 py-3 text-xs uppercase font-cinzel tracking-wider flex items-center justify-center gap-2 border-b-2 transition ${
                  activeTab === 'rangolis'
                    ? 'border-[#FFC857] text-[#FFC857] font-bold'
                    : 'border-transparent text-[#D6BD8B]/70 hover:text-white'
                }`}
              >
                <Palette className="w-4 h-4" />
                <span>My Rangolis ({savedRangolis.length})</span>
              </button>
              <button
                onClick={() => setActiveTab('ecards')}
                className={`flex-1 py-3 text-xs uppercase font-cinzel tracking-wider flex items-center justify-center gap-2 border-b-2 transition ${
                  activeTab === 'ecards'
                    ? 'border-[#FFC857] text-[#FFC857] font-bold'
                    : 'border-transparent text-[#D6BD8B]/70 hover:text-white'
                }`}
              >
                <Mail className="w-4 h-4" />
                <span>My E-Cards ({savedECards.length})</span>
              </button>
            </div>

            {/* List Content */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {activeTab === 'rangolis' ? (
                savedRangolis.length === 0 ? (
                  <div className="py-12 text-center text-[#D6BD8B]/60 text-xs">
                    <p>No saved Rangoli designs yet.</p>
                    <p className="mt-1">Design one in the Rangoli Studio and tap "Save to Profile"!</p>
                  </div>
                ) : (
                  savedRangolis.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 rounded-2xl bg-[#11152B]/70 border border-white/10 flex items-center justify-between gap-4 hover:border-[#FFC857]/40 transition group"
                    >
                      <div className="flex items-center gap-3">
                        {item.thumbnailUrl ? (
                          <img
                            src={item.thumbnailUrl}
                            alt={item.title}
                            className="w-14 h-14 rounded-xl object-contain bg-[#080B1A] border border-white/10 p-1"
                          />
                        ) : (
                          <div className="w-14 h-14 rounded-xl bg-[#080B1A] border border-white/10 flex items-center justify-center text-[#FF8C24]">
                            <Palette className="w-6 h-6" />
                          </div>
                        )}
                        <div>
                          <h4 className="font-playfair font-bold text-white text-base">
                            {item.title}
                          </h4>
                          <div className="flex items-center gap-3 text-[11px] text-[#D6BD8B]/70 mt-0.5">
                            <span className="flex items-center gap-1">
                              <Layers className="w-3 h-3 text-[#FF8C24]" />
                              {item.symmetry}-Fold Symmetry
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {new Date(item.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {onLoadRangoli && (
                          <button
                            onClick={() => {
                              onLoadRangoli(item);
                              onClose();
                            }}
                            className="py-1.5 px-3 rounded-full bg-[#FF8C24]/20 border border-[#FF8C24]/50 text-xs font-cinzel text-[#FFC857] hover:bg-[#FF8C24]/30 transition flex items-center gap-1"
                          >
                            <span>Load</span>
                            <ExternalLink className="w-3 h-3" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteRangoli(item.id)}
                          disabled={deletingId === item.id}
                          className="p-2 rounded-full border border-white/10 text-red-400 hover:bg-red-500/10 hover:border-red-500/30 transition"
                          title="Delete design"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )
              ) : (
                savedECards.length === 0 ? (
                  <div className="py-12 text-center text-[#D6BD8B]/60 text-xs">
                    <p>No saved E-Cards yet.</p>
                    <p className="mt-1">Craft a personalized greeting in the E-Cards tab and tap "Save to Profile"!</p>
                  </div>
                ) : (
                  savedECards.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 rounded-2xl bg-[#11152B]/70 border border-white/10 flex items-center justify-between gap-4 hover:border-[#FFC857]/40 transition group"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-full bg-[#FF8C24]/15 text-[#FFC857] text-[10px] font-cinzel uppercase font-bold">
                            {item.theme.replace('-', ' ')}
                          </span>
                          <span className="text-[11px] text-[#D6BD8B]/60">
                            {new Date(item.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <h4 className="font-playfair font-bold text-white text-base mt-1 truncate">
                          To: {item.recipient} • From: {item.sender}
                        </h4>
                        <p className="text-xs text-[#D6BD8B]/80 line-clamp-1 italic mt-0.5">
                          "{item.message}"
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        {onViewECard && (
                          <button
                            onClick={() => {
                              onViewECard(item);
                              onClose();
                            }}
                            className="py-1.5 px-3 rounded-full bg-[#FFC857]/15 border border-[#FFC857]/40 text-xs font-cinzel text-[#FFC857] hover:bg-[#FFC857]/25 transition flex items-center gap-1"
                          >
                            <span>Open</span>
                            <ExternalLink className="w-3 h-3" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteECard(item.id)}
                          disabled={deletingId === item.id}
                          className="p-2 rounded-full border border-white/10 text-red-400 hover:bg-red-500/10 hover:border-red-500/30 transition"
                          title="Delete card"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
