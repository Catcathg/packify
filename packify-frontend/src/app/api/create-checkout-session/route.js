import { NextResponse } from 'next/server';
import stripe from '../../../app/lib/stripe';

export async function POST(request) {
    try {
        const { activities } = await request.json();

        if (!activities || !Array.isArray(activities) || activities.length !== 3) {
            return NextResponse.json(
                { error: 'Données invalides - 3 activités requises' },
                { status: 400 }
            );
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'eur',
                        product_data: {
                            name: 'Pack Découverte Packify',
                            description: `3 activités sélectionnées : ${activities.map(a => a.name).join(', ')}`,
                        },
                        unit_amount: 6900,
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${request.headers.get('origin')}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${request.headers.get('origin')}/payment`,
            metadata: {
                activities: JSON.stringify(activities.map(a => ({ id: a.id, name: a.name }))),
            },
        });

        return NextResponse.json({ sessionId: session.id });

    } catch (error) {
        console.error('Erreur création session Stripe:', error);
        return NextResponse.json(
            { error: 'Erreur lors de la création de la session de paiement' },
            { status: 500 }
        );
    }
}