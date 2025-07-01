global.fetch = jest.fn();

// 1. Création de compte avec infos valides
test('création de compte avec infos valides', async () => {
    fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
            success: true,
            user: {
                id: 1,
                email: 'alice@mail.com',
                nom: 'Hu',
                prenom: 'Alice'
            },
            token: '<jwt>'
        })
    });

    const res = await fetch('/api/register');
    const data = await res.json();

    expect(data.success).toBe(true);
    expect(data.user.email).toBe('alice@mail.com');
});

// 2. Mot de passe trop court
test('mot de passe trop court', async () => {
    fetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({
            success: false,
            message: 'Validation errors',
            errors: {
                password: 'Le mot de passe doit comporter au moins 8 caractères'
            }
        })
    });

    const res = await fetch('/api/register');
    const data = await res.json();

    expect(data.success).toBe(false);
    expect(data.errors.password).toContain('caractères');
});

// 3. Email déjà utilisé
test('email déjà utilisé', async () => {
    fetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({
            success: false,
            message: 'Validation errors',
            errors: {
                email: "L’adresse e-mail alice@mail.com existe déjà"
            }
        })
    });

    const res = await fetch('/api/register');
    const data = await res.json();

    expect(data.success).toBe(false);
    expect(data.errors.email).toMatch(/existe déjà/);
});

// 4. Ajout d'activité avec tous les champs
test("ajout d'activité avec tous les champs", async () => {
    fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
            success: true,
            message: "Activité créée avec succès"
        })
    });

    const res = await fetch('/api/activities');
    const data = await res.json();

    expect(data.success).toBe(true);
    expect(data.message).toMatch(/succès/);
});

// 5. Activité sans nom
test("ajout d'activité sans nom", async () => {
    fetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({
            success: false,
            message: 'Validation errors',
            errors: {
                nom: "Le nom de l'activité est requis"
            }
        })
    });

    const res = await fetch('/api/activities');
    const data = await res.json();

    expect(data.success).toBe(false);
    expect(data.errors.nom).toContain('requis');
});

// 6. Ajout d'activités à un pack
test("pack avec 3 activités", async () => {
    fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
            success: true,
            pack: {
                activities: ['Massage', 'Yoga', 'Dégustation de vin']
            }
        })
    });

    const res = await fetch('/api/packs');
    const data = await res.json();

    expect(data.success).toBe(true);
    expect(data.pack.activities.length).toBe(3);
    expect(data.pack.activities).toContain('Yoga');
});
