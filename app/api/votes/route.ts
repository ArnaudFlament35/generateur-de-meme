import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { meme_id } = body;

    if (!meme_id) {
      return NextResponse.json(
        { error: 'meme_id requis' },
        { status: 400 }
      );
    }

    // Note: InstantDB gère les votes directement depuis le client avec useMutation
    // La logique de vote unique par utilisateur est gérée par InstantDB
    
    return NextResponse.json(
      { message: 'Vote enregistré' },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur lors du vote' },
      { status: 500 }
    );
  }
}


