import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../../config';
import { HiTrash, HiCheck, HiOutlineMailOpen } from 'react-icons/hi';

export default function MessagesInbox({ token }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusMsg, setStatusMsg] = useState('');

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = () => {
    fetch(`${API_BASE_URL}/contact/messages`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(res => {
        if (res.success && res.data) {
          setMessages(res.data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  const handleToggleRead = (id) => {
    fetch(`${API_BASE_URL}/contact/messages/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(res => {
        if (res.success) {
          fetchMessages();
        }
      })
      .catch(err => console.error(err));
  };

  const handleDelete = (id) => {
    if (!window.confirm('Delete this message permanently?')) return;
    setStatusMsg('');

    fetch(`${API_BASE_URL}/contact/messages/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(res => {
        if (res.success) {
          setStatusMsg('🗑️ Message deleted.');
          fetchMessages();
        }
      })
      .catch(err => {
        console.error(err);
        setStatusMsg('❌ Server error during delete.');
      });
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h3 style={{ marginBottom: 16 }}>Messages Inbox</h3>

      {statusMsg && (
        <div style={{ padding: 14, borderRadius: 8, background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-color)', marginBottom: 20 }}>
          {statusMsg}
        </div>
      )}

      {messages.length === 0 ? (
        <div className="glass-card" style={{ padding: 40, textAlign: 'center', color: 'var(--text-secondary)' }}>
          📩 No messages received yet.
        </div>
      ) : (
        <div className="message-list">
          {messages.map((msg) => (
            <div key={msg._id} className={`glass-card message-card ${!msg.isRead ? 'unread' : ''}`}>
              <div className="message-header">
                <div>
                  <span className="message-sender">{msg.name}</span>
                  <span style={{ margin: '0 8px', color: 'var(--text-muted)' }}>&bull;</span>
                  <a href={`mailto:${msg.email}`} style={{ color: 'var(--accent-primary)', fontSize: '0.85rem' }}>
                    {msg.email}
                  </a>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    className="admin-icon-btn"
                    onClick={() => handleToggleRead(msg._id)}
                    title={msg.isRead ? 'Mark as Unread' : 'Mark as Read'}
                  >
                    {msg.isRead ? <HiOutlineMailOpen /> : <HiCheck />}
                  </button>
                  <button
                    className="admin-icon-btn delete"
                    onClick={() => handleDelete(msg._id)}
                    title="Delete Message"
                  >
                    <HiTrash />
                  </button>
                </div>
              </div>
              <div className="message-subject">Subject: {msg.subject}</div>
              <div className="message-body">{msg.message}</div>
              <div className="message-meta" style={{ marginTop: 12, textAlign: 'right' }}>
                Received on: {new Date(msg.createdAt).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
