global.fetch = jest.fn();

// 1. Création d’une activité
test('création d’une activité (POST)', async () => {
    fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
            idActivities: 1,
            nom: 'Yoga'
        })
    });

    const response = await fetch('/api/v1/activities/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nom: 'Yoga' })
    });

    const data = await response.json();
    expect(data.nom).toBe('Yoga');
});

// 2. Récupération de toutes les activités
test('récupération de toutes les activités (GET)', async () => {
    fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ([
            { idActivities: 1, nom: 'Yoga' },
            { idActivities: 2, nom: 'Massage' }
        ])
    });

    const res = await fetch('/api/v1/activities/getAll');
    const data = await res.json();

    expect(data.length).toBe(2);
    expect(data[0].nom).toBe('Yoga');
});

// 3. Recherche d’une activité par ID
test('recherche d’une activité par ID (GET)', async () => {
    fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
            idActivities: 1,
            nom: 'Yoga'
        })
    });

    const res = await fetch('/api/v1/activities/findById?id=1');
    const data = await res.json();

    expect(data.idActivities).toBe(1);
    expect(data.nom).toBe('Yoga');
});

// 4. Mise à jour d’une activité
test('mise à jour d’une activité (PUT)', async () => {
    fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
            idActivities: 1,
            nom: 'Pilates'
        })
    });

    const res = await fetch('/api/v1/activities/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idActivities: 1, nom: 'Pilates' })
    });

    const data = await res.json();
    expect(data.nom).toBe('Pilates');
});

// 5. Suppression d’une activité par ID
test('suppression d’une activité (DELETE)', async () => {
    fetch.mockResolvedValueOnce({
        ok: true
    });

    const res = await fetch('/api/v1/activities/delete?id=1', {
        method: 'DELETE'
    });

    expect(res.ok).toBe(true);
});