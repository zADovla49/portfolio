import React, { useState } from 'react';
import { ArrowUpRight, Send, Pencil, Trash2, Check, X, AlertCircle } from 'lucide-react';
import ADMonogram from '../ADMonogram';
import type { TransmissionItem } from '../../types/portfolio';

interface ContactSectionProps {
  transmissions: TransmissionItem[];
  visitorToken: string;
  loadingTransmissions: boolean;
  transmissionError: string | null;
  onCreate: (sender_name: string, topic: string, message: string) => Promise<void>;
  onUpdate: (id: number, sender_name: string, topic: string, message: string) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  transmissions,
  visitorToken,
  loadingTransmissions,
  transmissionError,
  onCreate,
  onUpdate,
  onDelete,
}) => {
  const [senderName, setSenderName] = useState('');
  const [topic, setTopic] = useState('Project & Vision');
  const [message, setMessage] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState('');
  const [editTopic, setEditTopic] = useState('');
  const [editMessage, setEditMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setSubmittedSuccess(false);

    if (senderName.trim().length < 2) {
      setFormError('Please enter your name (at least 2 characters).');
      return;
    }
    if (message.trim().length < 5) {
      setFormError('Please write a thoughtful message (at least 5 characters).');
      return;
    }

    setSubmitting(true);
    try {
      await onCreate(senderName.trim(), topic.trim(), message.trim());
      setSenderName('');
      setMessage('');
      setSubmittedSuccess(true);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Unable to send message.');
    } finally {
      setSubmitting(false);
    }
  };

  const startEdit = (item: TransmissionItem) => {
    setEditingId(item.id);
    setEditName(item.sender_name);
    setEditTopic(item.topic);
    setEditMessage(item.message);
  };

  const saveEdit = async (id: number) => {
    if (!editName.trim() || !editMessage.trim()) return;
    setSubmitting(true);
    try {
      await onUpdate(id, editName.trim(), editTopic.trim(), editMessage.trim());
      setEditingId(null);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Unable to update message.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <footer
      id="contact"
      data-section="contact"
      className="gsap-section relative pt-28 sm:pt-36 lg:pt-44 pb-16 px-6 sm:px-10 lg:px-16 border-t border-slate-900/90"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-10 gsap-reveal">
          <ADMonogram size={28} />
          <div className="h-[1px] w-12 bg-gradient-to-r from-sky-400 to-transparent" />
          <span className="font-mono text-[11px] tracking-[0.34em] text-sky-400 uppercase">
            05 // VISION & CONNECTION
          </span>
        </div>

        {/* Monumental Final Headline */}
        <div className="max-w-5xl gsap-reveal">
          <h2 className="font-display text-4xl sm:text-6xl lg:text-7xl font-bold tracking-[0.08em] leading-[1.05] metallic-text uppercase">
            EVERYTHING STARTS
            <br />
            WITH A VISION.
          </h2>

          <p className="mt-7 text-lg sm:text-2xl text-slate-300/95 font-light tracking-wide max-w-2xl">
            Still learning. Always improving. Building what comes next.
          </p>

          {/* Verified Real Profile Link Only */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href="https://github.com/zadovla49"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-3 px-6 py-3.5 rounded-full glass-chrome border border-slate-700/80 hover:border-sky-400/70 text-xs font-mono tracking-[0.26em] text-slate-100 uppercase transition-all duration-300"
            >
              <span>GITHUB // ZADOVLA49</span>
              <ArrowUpRight className="w-4 h-4 text-sky-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          </div>
        </div>

        {/* Direct Dispatch & Reflections Ledger (Supabase-persisted) */}
        <div className="mt-20 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start gsap-reveal">
          {/* Left: Leave a Direct Note */}
          <div className="lg:col-span-6 rounded-2xl glass-chrome border border-slate-800/90 p-6 sm:p-8">
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-800/80">
              <span className="font-mono text-[11px] tracking-[0.28em] text-slate-200 uppercase">
                LEAVE A DIRECT NOTE
              </span>
              <span className="font-mono text-[10px] tracking-[0.24em] text-sky-400 uppercase">
                DISPATCH TERMINAL
              </span>
            </div>

            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="visitor-name"
                    className="block font-mono text-[10px] tracking-[0.25em] text-slate-400 uppercase mb-2"
                  >
                    YOUR NAME *
                  </label>
                  <input
                    id="visitor-name"
                    type="text"
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    placeholder="Enter your name"
                    maxLength={80}
                    className="w-full rounded-xl bg-slate-950/80 border border-slate-800 focus:border-sky-400/70 px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label
                    htmlFor="visitor-topic"
                    className="block font-mono text-[10px] tracking-[0.25em] text-slate-400 uppercase mb-2"
                  >
                    SUBJECT
                  </label>
                  <select
                    id="visitor-topic"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="w-full rounded-xl bg-slate-950/80 border border-slate-800 focus:border-sky-400/70 px-4 py-3 text-sm text-slate-200 focus:outline-none transition-colors"
                  >
                    <option value="Project & Vision">Project & Vision</option>
                    <option value="Cybersecurity & Tech">Cybersecurity & Tech</option>
                    <option value="Judo & Discipline">Judo & Discipline</option>
                    <option value="General Encouragement">General Encouragement</option>
                  </select>
                </div>
              </div>

              <div>
                <label
                  htmlFor="visitor-message"
                  className="block font-mono text-[10px] tracking-[0.25em] text-slate-400 uppercase mb-2"
                >
                  MESSAGE *
                </label>
                <textarea
                  id="visitor-message"
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Share a respectful note or perspective..."
                  maxLength={600}
                  className="w-full rounded-xl bg-slate-950/80 border border-slate-800 focus:border-sky-400/70 px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none transition-colors resize-none"
                />
              </div>

              {formError && (
                <div className="flex items-center gap-2 text-xs text-rose-300 bg-rose-950/40 border border-rose-800/50 px-3.5 py-2.5 rounded-lg">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {submittedSuccess && (
                <div className="text-xs font-mono tracking-[0.16em] text-sky-300 bg-sky-950/40 border border-sky-500/30 px-3.5 py-2.5 rounded-lg">
                  MESSAGE RECORDED. THANK YOU FOR YOUR NOTE.
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-3 px-6 py-3.5 rounded-full bg-sky-500/20 hover:bg-sky-500/30 border border-sky-400/60 text-xs font-mono tracking-[0.26em] text-white uppercase transition-all disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5 text-sky-400" />
                <span>{submitting ? 'TRANSMITTING...' : 'SEND MESSAGE'}</span>
              </button>
            </form>
          </div>

          {/* Right: Recent Visitor Notes */}
          <div className="lg:col-span-6 rounded-2xl glass-chrome border border-slate-800/90 p-6 sm:p-8">
            <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-800/80">
              <span className="font-mono text-[11px] tracking-[0.28em] text-slate-200 uppercase">
                VISITOR DISPATCH LOG
              </span>
              <span className="font-mono text-[10px] tracking-[0.24em] text-slate-400 uppercase">
                {transmissions.length} RECORDED
              </span>
            </div>

            {transmissionError && (
              <div className="mb-4 flex items-center gap-2 text-xs text-amber-300 bg-amber-950/30 border border-amber-800/40 px-3.5 py-2.5 rounded-lg">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{transmissionError}</span>
              </div>
            )}

            {loadingTransmissions ? (
              <div className="space-y-3">
                {[1, 2, 3].map((n) => (
                  <div
                    key={n}
                    className="h-20 rounded-xl bg-slate-900/60 border border-slate-800/60 animate-pulse"
                  />
                ))}
              </div>
            ) : transmissions.length === 0 ? (
              <p className="text-sm text-slate-500 font-light py-8 text-center">
                No visitor notes yet. Be the first to leave a message.
              </p>
            ) : (
              <div className="space-y-3.5 max-h-[340px] overflow-y-auto pr-1 custom-scrollbar">
                {transmissions.map((item) => {
                  const isMine = item.client_token === visitorToken;
                  const isEditing = editingId === item.id;

                  return (
                    <div
                      key={item.id}
                      className="rounded-xl bg-slate-950/65 border border-slate-800/80 p-4 transition-colors hover:border-slate-700/80"
                    >
                      {isEditing ? (
                        <div className="space-y-2.5">
                          <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-1.5 text-xs text-white"
                          />
                          <textarea
                            rows={2}
                            value={editMessage}
                            onChange={(e) => setEditMessage(e.target.value)}
                            className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-1.5 text-xs text-white resize-none"
                          />
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => saveEdit(item.id)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-sky-500/25 border border-sky-400/50 text-[10px] font-mono text-white"
                            >
                              <Check className="w-3 h-3" /> SAVE
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingId(null)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 text-[10px] font-mono text-slate-300"
                            >
                              <X className="w-3 h-3" /> CANCEL
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center justify-between gap-2 mb-1.5">
                            <div className="flex items-center gap-2">
                              <span className="font-display text-xs tracking-[0.14em] text-white uppercase">
                                {item.sender_name}
                              </span>
                              <span className="font-mono text-[9px] tracking-[0.2em] text-sky-400/90 uppercase px-2 py-0.5 rounded-full bg-sky-500/10 border border-sky-500/20">
                                {item.topic}
                              </span>
                            </div>

                            {isMine && (
                              <div className="flex items-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => startEdit(item)}
                                  className="p-1 text-slate-400 hover:text-sky-400 transition-colors"
                                  aria-label="Edit your note"
                                >
                                  <Pencil className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => onDelete(item.id)}
                                  className="p-1 text-slate-400 hover:text-rose-400 transition-colors"
                                  aria-label="Delete your note"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            )}
                          </div>
                          <p className="text-xs sm:text-sm text-slate-300/90 font-light leading-relaxed">
                            {item.message}
                          </p>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Final Brand Signature Seal */}
        <div className="mt-24 pt-10 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <ADMonogram size={42} glow />
            <div>
              <p className="font-display text-xs sm:text-sm tracking-[0.3em] text-white uppercase">
                ABDULLOH — MADE BY ABDULLOH.
              </p>
              <p className="font-mono text-[10px] tracking-[0.28em] text-slate-500 uppercase mt-1">
                QUIET MIND. PRECISE EXECUTION. THE WORK SPEAKS FOR ITSELF.
              </p>
            </div>
          </div>

          <div className="font-mono text-[10px] tracking-[0.26em] text-slate-500 uppercase">
            © {new Date().getFullYear()} ABDULLOH DOVLATBOEV
          </div>
        </div>
      </div>
    </footer>
  );
};

export default ContactSection;
