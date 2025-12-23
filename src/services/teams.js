import { supabase } from '../lib/supabase'

export const teamsService = {
    async fetchTeams() {
        if (!supabase) return { AMORAGA: [], DAVID: [], SANDRA: [] }

        const { data, error } = await supabase
            .from('salespeople')
            .select('*')

        if (error) {
            console.error('Error fetching teams:', error)
            return { AMORAGA: [], DAVID: [], SANDRA: [] }
        }

        // Transform list to object
        const teams = { AMORAGA: [], DAVID: [], SANDRA: [] }
        data.forEach(p => {
            if (!teams[p.team]) teams[p.team] = []
            teams[p.team].push(p.name)
        })
        return teams
    },

    async addMember(name, team) {
        if (!supabase) return false
        const { error } = await supabase
            .from('salespeople')
            .insert([{ name, team }])

        if (error) {
            console.error('Error adding member:', error)
            return false
        }
        return true
    },

    async removeMember(name) {
        if (!supabase) return false
        const { error } = await supabase
            .from('salespeople')
            .delete()
            .eq('name', name)

        if (error) {
            console.error('Error removing member:', error)
            return false
        }
        return true
    }
}
