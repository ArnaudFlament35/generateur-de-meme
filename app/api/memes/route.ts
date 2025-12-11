import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/instantdb';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { image_base64, title } = body;

    if (!image_base64) {
      return NextResponse.json(
        { error: 'Image base64 requise' },
        { status: 400 }
      );
    }

    // Note: InstantDB gère l'authentification automatiquement via les tokens
    // L'utilisateur doit être authentifié pour créer un meme
    // La création se fait directement depuis le client avec useMutation
    
    return NextResponse.json(
      { message: 'Meme créé avec succès' },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur lors de la création du meme' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // La récupération des memes se fait directement depuis le client avec useQuery
    return NextResponse.json({ memes: [] }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des memes' },
      { status: 500 }
    );
  }
}


