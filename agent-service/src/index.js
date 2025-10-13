// Note: This mock agent simulates AI responses without using OpenAI. 
// It detects language (DE, EN, FR) and intent to provide relevant answers about cleaning services.
// Uncomment the OpenAI section below to use real AI responses (requires OPENAI_API_KEY in .env)
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(cors());
app.use(express.json());

// Mock AI responses - multilingual
const MOCK_RESPONSES = {
  de: {
    greeting: [
      'Hallo! Ich bin der Zoman-Assistent. Wie kann ich Ihnen helfen?',
      'Guten Tag! Haben Sie Fragen zu unseren Reinigungsdiensten?',
      'Willkommen bei Zoman! Was möchten Sie wissen?'
    ],
    hausreinigung: [
      'Unsere Hausreinigung kostet ab 25€ pro Stunde. Wir reinigen Küche, Bad, Böden und mehr. Möchten Sie mehr Details?',
      'Bei der Hausreinigung kümmern wir uns um alle Räume - von Küche bis Badezimmer. Der Preis beginnt bei 25€/Stunde. Individuelle Pakete sind verfügbar!'
    ],
    fensterreinigung: [
      'Fensterreinigung kostet ab 3€ pro Fenster für Standardfenster. Wir reinigen innen, außen und die Rahmen streifenfrei!',
      'Unsere Fensterreinigung ist streifenfrei garantiert! Ab 3€ pro Fenster, inklusive Rahmen und Fensterbänke.'
    ],
    solar: [
      'Solaranlagenreinigung wird individuell nach Größe berechnet. Eine saubere Anlage bringt bis zu 25% mehr Energieausbeute! Wir bieten eine kostenlose Besichtigung an.',
      'Ihre Solarmodule verdienen die beste Pflege! Wir reinigen schonend und umweltfreundlich. Der Preis hängt von der Anlagengröße ab - kontaktieren Sie uns für ein Angebot!'
    ],
    preis: [
      'Unsere Preise: Hausreinigung ab 25€/Stunde, Fensterreinigung ab 3€/Fenster, Solarreinigung individuell. Für ein genaues Angebot kontaktieren Sie uns bitte!',
      'Wir bieten faire Preise: 25€/Std für Hausreinigung, 3€/Fenster für Fensterreinigung. Solarreinigung nach Größe. Rufen Sie uns an für Details!'
    ],
    termin: [
      'Für eine Terminvereinbarung nutzen Sie bitte unser Kontaktformular oder rufen Sie uns direkt an: +49 123 456 7890. Wir melden uns schnellstmöglich!',
      'Gerne! Bitte kontaktieren Sie uns über das Formular auf der Kontaktseite oder telefonisch unter +49 123 456 7890. Wir sind Mo-Fr 8-18 Uhr erreichbar.'
    ],
    kontakt: [
      'Sie erreichen uns: Telefon +49 123 456 7890, E-Mail info@zoman-gebaudereinigung.de. Öffnungszeiten: Mo-Fr 8-18 Uhr, Sa 9-14 Uhr.',
      'Kontaktieren Sie uns: ☎️ +49 123 456 7890, ✉️ info@zoman-gebaudereinigung.de. Wir sind in Krefeld für Sie da!'
    ],
    default: [
      'Das ist eine gute Frage! Wir bieten Hausreinigung (ab 25€/Std), Fensterreinigung (ab 3€/Fenster) und Solaranlagenreinigung. Was interessiert Sie?',
      'Wir sind spezialisiert auf Hausreinigung, Fensterreinigung und Solaranlagenreinigung in Krefeld. Möchten Sie mehr über einen dieser Dienste erfahren?',
      'Gerne helfe ich Ihnen weiter! Haben Sie Fragen zu unseren Reinigungsdiensten, Preisen oder möchten Sie einen Termin vereinbaren?'
    ]
  },
  en: {
    greeting: [
      'Hello! I\'m the Zoman assistant. How can I help you?',
      'Good day! Do you have questions about our cleaning services?',
      'Welcome to Zoman! What would you like to know?'
    ],
    hausreinigung: [
      'Our house cleaning starts at €25 per hour. We clean kitchen, bathroom, floors and more. Would you like more details?',
      'For house cleaning, we take care of all rooms - from kitchen to bathroom. Price starts at €25/hour. Individual packages available!'
    ],
    fensterreinigung: [
      'Window cleaning costs from €3 per window for standard windows. We clean inside, outside and frames streak-free!',
      'Our window cleaning is streak-free guaranteed! From €3 per window, including frames and sills.'
    ],
    solar: [
      'Solar panel cleaning is calculated individually by size. A clean system brings up to 25% more energy yield! We offer free inspection.',
      'Your solar modules deserve the best care! We clean gently and eco-friendly. Price depends on system size - contact us for a quote!'
    ],
    preis: [
      'Our prices: House cleaning from €25/hour, window cleaning from €3/window, solar cleaning individually. Please contact us for exact quote!',
      'We offer fair prices: €25/hr for house cleaning, €3/window for window cleaning. Solar cleaning by size. Call us for details!'
    ],
    termin: [
      'To schedule an appointment, please use our contact form or call us directly: +49 123 456 7890. We\'ll get back to you ASAP!',
      'Gladly! Please contact us via the form on the contact page or by phone at +49 123 456 7890. We\'re available Mon-Fri 8am-6pm.'
    ],
    kontakt: [
      'You can reach us: Phone +49 123 456 7890, Email info@zoman-gebaudereinigung.de. Hours: Mon-Fri 8am-6pm, Sat 9am-2pm.',
      'Contact us: ☎️ +49 123 456 7890, ✉️ info@zoman-gebaudereinigung.de. We\'re here for you in Krefeld!'
    ],
    default: [
      'That\'s a good question! We offer house cleaning (from €25/hr), window cleaning (from €3/window) and solar panel cleaning. What interests you?',
      'We specialize in house cleaning, window cleaning and solar panel cleaning in Krefeld. Would you like to know more about any of these services?',
      'Happy to help! Do you have questions about our cleaning services, prices or would you like to schedule an appointment?'
    ]
  },
  fr: {
    greeting: [
      'Bonjour! Je suis l\'assistant Zoman. Comment puis-je vous aider?',
      'Bonjour! Avez-vous des questions sur nos services de nettoyage?',
      'Bienvenue chez Zoman! Que voulez-vous savoir?'
    ],
    hausreinigung: [
      'Notre nettoyage de maison commence à 25€ par heure. Nous nettoyons cuisine, salle de bain, sols et plus. Voulez-vous plus de détails?',
      'Pour le nettoyage de maison, nous nous occupons de toutes les pièces - de la cuisine à la salle de bain. Le prix commence à 25€/heure. Forfaits individuels disponibles!'
    ],
    fensterreinigung: [
      'Le nettoyage de vitres coûte à partir de 3€ par fenêtre pour les fenêtres standard. Nous nettoyons l\'intérieur, l\'extérieur et les cadres sans traces!',
      'Notre nettoyage de vitres est garanti sans traces! À partir de 3€ par fenêtre, cadres et rebords inclus.'
    ],
    solar: [
      'Le nettoyage de panneaux solaires est calculé individuellement selon la taille. Un système propre apporte jusqu\'à 25% de rendement énergétique en plus! Nous offrons une inspection gratuite.',
      'Vos modules solaires méritent les meilleurs soins! Nous nettoyons doucement et écologiquement. Le prix dépend de la taille du système - contactez-nous pour un devis!'
    ],
    preis: [
      'Nos prix: Nettoyage de maison à partir de 25€/heure, nettoyage de vitres à partir de 3€/fenêtre, nettoyage solaire individuellement. Contactez-nous pour un devis exact!',
      'Nous offrons des prix équitables: 25€/h pour le nettoyage de maison, 3€/fenêtre pour le nettoyage de vitres. Nettoyage solaire selon la taille. Appelez-nous pour les détails!'
    ],
    termin: [
      'Pour prendre rendez-vous, veuillez utiliser notre formulaire de contact ou nous appeler directement: +49 123 456 7890. Nous vous répondrons rapidement!',
      'Avec plaisir! Contactez-nous via le formulaire sur la page contact ou par téléphone au +49 123 456 7890. Nous sommes disponibles Lun-Ven 8h-18h.'
    ],
    kontakt: [
      'Vous pouvez nous joindre: Téléphone +49 123 456 7890, Email info@zoman-gebaudereinigung.de. Horaires: Lun-Ven 8h-18h, Sam 9h-14h.',
      'Contactez-nous: ☎️ +49 123 456 7890, ✉️ info@zoman-gebaudereinigung.de. Nous sommes là pour vous à Krefeld!'
    ],
    default: [
      'C\'est une bonne question! Nous proposons le nettoyage de maison (à partir de 25€/h), le nettoyage de vitres (à partir de 3€/fenêtre) et le nettoyage de panneaux solaires. Qu\'est-ce qui vous intéresse?',
      'Nous sommes spécialisés dans le nettoyage de maison, le nettoyage de vitres et le nettoyage de panneaux solaires à Krefeld. Voulez-vous en savoir plus sur l\'un de ces services?',
      'Heureux de vous aider! Avez-vous des questions sur nos services de nettoyage, les prix ou souhaitez-vous prendre rendez-vous?'
    ]
  }
};

// Detect language from message
function detectLanguage(message) {
  const msg = message.toLowerCase();
  
  // French indicators
  if (/(bonjour|salut|merci|oui|non|comment|prix|combien|je voudrais|pouvez-vous)/i.test(msg)) {
    return 'fr';
  }
  
  // English indicators
  if (/(hello|hi|thanks|yes|no|how|price|cost|would like|can you|what|when)/i.test(msg)) {
    return 'en';
  }
  
  // Default to German
  return 'de';
}

// Detect intent from message
function detectIntent(message) {
  const msg = message.toLowerCase();
  
  // Greetings
  if (/(hallo|hi|hey|guten tag|servus|moin|grüß|bonjour|salut|hello)/i.test(msg)) {
    return 'greeting';
  }
  
  // House cleaning
  if (/(haus|wohnung|home|house|cleaning|putzen|reinigung|maison|nettoyage).*(reinig|clean|putz|nettoyage)/i.test(msg) ||
      /(hausreinigung|house cleaning|nettoyage de maison)/i.test(msg)) {
    return 'hausreinigung';
  }
  
  // Window cleaning
  if (/(fenster|window|vitres).*(reinig|clean|putz|nettoyage)/i.test(msg) ||
      /(fensterreinigung|window cleaning|nettoyage de vitres)/i.test(msg)) {
    return 'fensterreinigung';
  }
  
  // Solar cleaning
  if (/(solar|photovoltaik|pv|panel|panneau).*(reinig|clean|nettoyage)/i.test(msg) ||
      /(solarreinigung|solar cleaning|nettoyage solaire)/i.test(msg)) {
    return 'solar';
  }
  
  // Pricing
  if (/(preis|cost|kosten|kostet|price|tarif|prix|combien)/i.test(msg)) {
    return 'preis';
  }
  
  // Appointment/Booking
  if (/(termin|appointment|book|buchen|buchung|rendez-vous|heute|morgen|nächste woche|today|tomorrow|next week|réserver)/i.test(msg)) {
    return 'termin';
  }
  
  // Contact
  if (/(kontakt|contact|telefon|phone|email|erreichen|anruf|appeler|joindre)/i.test(msg)) {
    return 'kontakt';
  }
  
  return 'default';
}

// Get random response from array
function getRandomResponse(responses) {
  return responses[Math.floor(Math.random() * responses.length)];
}

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'agent', mode: 'mock' });
});

// Chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message, history = [] } = req.body;

    // Validation
    if (!message || typeof message !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Message is required',
      });
    }

    // Limit message length
    if (message.length > 500) {
      return res.status(400).json({
        success: false,
        error: 'Message too long (max 500 characters)',
      });
    }

    // Simulate thinking delay (like real AI)
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));

    // Detect language and intent
    const language = detectLanguage(message);
    const intent = detectIntent(message);
    const responses = MOCK_RESPONSES[language][intent] || MOCK_RESPONSES[language].default;
    const reply = getRandomResponse(responses);

    // Detect if user needs contact
    const needsContact = intent === 'termin';

    console.log(`💬 Mock Chat [${language}/${intent}]: "${message.substring(0, 50)}..." → "${reply.substring(0, 50)}..."`);

    res.json({
      success: true,
      reply: reply,
      needsContact: needsContact,
      mode: 'mock',
      language: language,
      usage: {
        prompt_tokens: 0,
        completion_tokens: 0,
        total_tokens: 0,
      }
    });

  } catch (error) {
    console.error('❌ Chat error:', error);
    
    res.status(500).json({
      success: false,
      error: 'Failed to process chat message',
      details: error.message,
    });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Endpoint not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🤖 Agent service running on http://localhost:${PORT}`);
  console.log(`🧪 MODE: MOCK (No OpenAI needed)`);
  console.log(`🌍 Languages: DE, EN, FR`);
  console.log(`✅ Health check: http://localhost:${PORT}/health`);
});



// To use openai, uncomment this code below and set OPENAI_API_KEY in .env

/*
import express from 'express';
import OpenAI from 'openai';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// System prompt - defines the AI agent's personality and knowledge
const SYSTEM_PROMPT = `Du bist ein freundlicher Kundenservice-Assistent für Zoman Gebäudereinigung, ein professionelles Reinigungsunternehmen in Krefeld, Deutschland.

DEINE AUFGABE:
- Beantworte Fragen zu unseren Dienstleistungen freundlich und präzise
- Gib hilfreiche Informationen über Preise und Ablauf
- Leite bei konkreten Buchungen zum Kontaktformular weiter

UNSERE DIENSTLEISTUNGEN:

1. HAUSREINIGUNG
   - Gründliche Reinigung von Häusern und Wohnungen
   - Küche, Bad, Böden, Möbel abstauben
   - Preis: Ab 25€ pro Stunde
   - Individuelle Pakete verfügbar

2. FENSTERREINIGUNG
   - Streifenfreie Reinigung innen und außen
   - Fensterrahmen und Fensterbänke inklusive
   - Preis: Ab 3€ pro Fenster (Standard)
   - Großflächen auf Anfrage

3. SOLARANLAGENREINIGUNG
   - Professionelle Photovoltaik-Reinigung
   - Bis zu 25% mehr Energieausbeute
   - Schonende, umweltfreundliche Reinigung
   - Preis: Individuell nach Anlagengröße

KONTAKTDATEN:
- Telefon: +49 123 456 7890
- E-Mail: info@zoman-gebaudereinigung.de
- Standort: Krefeld, Deutschland
- Öffnungszeiten: Mo-Fr 8-18 Uhr, Sa 9-14 Uhr

WICHTIGE REGELN:
- Antworte auf Deutsch, Englisch oder Französisch (je nach Kundensprache)
- Sei präzise aber freundlich
- Bei Terminanfragen: Verweise auf Kontaktformular oder Telefon
- Bei Unsicherheit: Empfehle direkten Kontakt
- Erfinde KEINE Informationen, die nicht im Prompt stehen
- Halte Antworten kurz (2-4 Sätze maximal)`;

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'agent' });
});

// Chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message, history = [] } = req.body;

    // Validation
    if (!message || typeof message !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Message is required',
      });
    }

    // Limit message length
    if (message.length > 500) {
      return res.status(400).json({
        success: false,
        error: 'Message too long (max 500 characters)',
      });
    }

    // Prepare messages for OpenAI
    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...history.slice(-10), // Only keep last 10 messages for context
      { role: 'user', content: message },
    ];

    // Call OpenAI
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini', // Cheaper and faster than GPT-4
      messages: messages,
      temperature: 0.7,
      max_tokens: 200,
    });

    const reply = completion.choices[0].message.content;

    // Detect if user needs contact (simple keyword detection)
    const needsContactKeywords = [
      'termin', 'buchen', 'buchung', 'appointment', 'book', 'rendez-vous',
      'heute', 'morgen', 'nächste woche', 'today', 'tomorrow', 'next week',
      'angebot', 'quote', 'besichtigung', 'visit'
    ];
    
    const needsContact = needsContactKeywords.some(keyword => 
      message.toLowerCase().includes(keyword)
    );

    console.log(`💬 Chat: "${message.substring(0, 50)}..." → "${reply.substring(0, 50)}..."`);

    res.json({
      success: true,
      reply: reply,
      needsContact: needsContact,
      usage: {
        prompt_tokens: completion.usage.prompt_tokens,
        completion_tokens: completion.usage.completion_tokens,
        total_tokens: completion.usage.total_tokens,
      }
    });

  } catch (error) {
    console.error('❌ Chat error:', error);
    
    // Handle OpenAI specific errors
    if (error.code === 'insufficient_quota') {
      return res.status(402).json({
        success: false,
        error: 'OpenAI quota exceeded. Please add credits.',
      });
    }

    res.status(500).json({
      success: false,
      error: 'Failed to process chat message',
      details: error.message,
    });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Endpoint not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🤖 Agent service running on http://localhost:${PORT}`);
  console.log(`🔑 OpenAI API key configured: ${process.env.OPENAI_API_KEY ? '✅' : '❌'}`);
  console.log(`✅ Health check: http://localhost:${PORT}/health`);
});
*/