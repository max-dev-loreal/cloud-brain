import { create } from 'zustand'
import { MAX_EVENTS } from '@/shared/config/constants'

let _id = 0

export const useEventsStore = create((set, get) => ({
  events: [
    { id: _id++, type: 'ok',   message: 'System initialized',    time: 'T+0s' },
    { id: _id++, type: 'info', message: 'AI Orchestrator online', time: 'T+0s' },
    { id: _id++, type: 'ok',   message: 'All nodes healthy',      time: 'T+0s' },
  ],

  // Add a single event
  addEvent: ({ type, message, time = 'T+0s' }) =>
    set(state => ({
      events: [
        { id: _id++, type, message, time },
        ...state.events,
      ].slice(0, MAX_EVENTS),
    })),

  // Add multiple events at once (batch from backend)
  addEvents: (newEvents) =>
    set(state => ({
      events: [
        ...newEvents.map(e => ({ id: _id++, ...e })),
        ...state.events,
      ].slice(0, MAX_EVENTS),
    })),

  clearEvents: () => set({ events: [] }),

  // Filter by type for a future panel
  getByType: (type) => get().events.filter(e => e.type === type),
}))
