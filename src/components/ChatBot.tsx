import React, { useState, useRef, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { Send, Bot, User } from 'lucide-react';
import { db } from '../config/firebase';
import { useAuth } from '../hooks/useAuth';
import { Produit, Magasin, Stock, User as UserType } from '../types';

interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export const ChatBot: React.FC = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      content: `Bonjour ${user?.prenom} ${user?.nom} ! Je suis votre assistant IA pour StockPro. Je peux vous aider avec des questions sur les stocks, produits, magasins, et bien plus encore. Comment puis-je vous aider aujourd'hui ?`,
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [appData, setAppData] = useState({
    produits: [] as Produit[],
    magasins: [] as Magasin[],
    stocks: [] as Stock[],
    users: [] as UserType[]
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    fetchAppData();
  }, []);

  const fetchAppData = async () => {
    try {
      const [produitsSnapshot, magasinsSnapshot, stocksSnapshot, usersSnapshot] = await Promise.all([
        getDocs(collection(db, 'produits')),
        getDocs(collection(db, 'magasins')),
        getDocs(collection(db, 'stocks')),
        getDocs(collection(db, 'users'))
      ]);

      setAppData({
        produits: produitsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Produit[],
        magasins: magasinsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Magasin[],
        stocks: stocksSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Stock[],
        users: usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as UserType[]
      });
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    }
  };

  const generateBotResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();

    // Questions sur les magasins/boutiques
    if (message.includes('combien') && (message.includes('magasin') || message.includes('boutique') || message.includes('point de vente'))) {
      const count = appData.magasins.length;
      if (count === 0) {
        return "Il n'y a actuellement aucun magasin enregistré dans le système.";
      } else if (count === 1) {
        return `Il y a actuellement 1 magasin enregistré : ${appData.magasins[0].nom}.`;
      } else {
        const magasinsList = appData.magasins.map(m => m.nom).join(', ');
        return `Il y a actuellement ${count} magasins enregistrés : ${magasinsList}.`;
      }
    }

    // Questions sur les produits
    if (message.includes('combien') && message.includes('produit')) {
      const count = appData.produits.length;
      if (count === 0) {
        return "Il n'y a actuellement aucun produit enregistré dans le système.";
      } else {
        return `Il y a actuellement ${count} produit${count > 1 ? 's' : ''} enregistré${count > 1 ? 's' : ''} dans le système.`;
      }
    }

    if ((message.includes('quels') || message.includes('quelles')) && message.includes('produit')) {
      if (appData.produits.length === 0) {
        return "Aucun produit n'est actuellement enregistré dans le système.";
      } else {
        const produitsList = appData.produits.slice(0, 10).map(p => `${p.nom} (Réf: ${p.reference})`).join(', ');
        const moreText = appData.produits.length > 10 ? ` et ${appData.produits.length - 10} autres...` : '';
        return `Voici les produits enregistrés : ${produitsList}${moreText}`;
      }
    }

    // Questions sur les stocks
    if (message.includes('stock') && (message.includes('total') || message.includes('combien'))) {
      const totalStock = appData.stocks.reduce((total, stock) => total + stock.quantite, 0);
      return `Le stock total dans tous les magasins est de ${totalStock} unités réparties sur ${appData.stocks.length} références produits.`;
    }

    // Questions sur les employés
    if (message.includes('combien') && (message.includes('employé') || message.includes('utilisateur'))) {
      const employes = appData.users.filter(u => u.role === 'employe');
      const admins = appData.users.filter(u => u.role === 'admin');
      return `Il y a actuellement ${employes.length} employé${employes.length > 1 ? 's' : ''} et ${admins.length} administrateur${admins.length > 1 ? 's' : ''} dans le système.`;
    }

    // Questions sur les catégories
    if (message.includes('catégorie') || message.includes('categories')) {
      const categories = [...new Set(appData.produits.map(p => p.categorie))];
      if (categories.length === 0) {
        return "Aucune catégorie de produit n'est définie.";
      } else {
        return `Les catégories de produits disponibles sont : ${categories.join(', ')}.`;
      }
    }

    // Questions sur les alertes de stock
    if (message.includes('alerte') || message.includes('rupture')) {
      const alertes = appData.stocks.filter(stock => {
        const produit = appData.produits.find(p => p.id === stock.produit_id);
        return produit && stock.quantite <= produit.seuil_alerte;
      });
      
      if (alertes.length === 0) {
        return "Aucun produit n'est actuellement en alerte de stock bas.";
      } else {
        return `Il y a ${alertes.length} produit${alertes.length > 1 ? 's' : ''} en alerte de stock bas qui nécessite${alertes.length > 1 ? 'nt' : ''} votre attention.`;
      }
    }

    // Questions sur un magasin spécifique
    const magasinMentionne = appData.magasins.find(m => 
      message.includes(m.nom.toLowerCase())
    );
    if (magasinMentionne) {
      const stocksMagasin = appData.stocks.filter(s => s.magasin_id === magasinMentionne.id);
      const totalQuantite = stocksMagasin.reduce((total, stock) => total + stock.quantite, 0);
      return `Le magasin "${magasinMentionne.nom}" a ${stocksMagasin.length} références produits en stock pour un total de ${totalQuantite} unités. Adresse : ${magasinMentionne.adresse}.`;
    }

    // Questions sur un produit spécifique
    const produitMentionne = appData.produits.find(p => 
      message.includes(p.nom.toLowerCase()) || message.includes(p.reference.toLowerCase())
    );
    if (produitMentionne) {
      const stocksProduit = appData.stocks.filter(s => s.produit_id === produitMentionne.id);
      const totalQuantite = stocksProduit.reduce((total, stock) => total + stock.quantite, 0);
      const magasinsAvecStock = stocksProduit.map(stock => {
        const magasin = appData.magasins.find(m => m.id === stock.magasin_id);
        return magasin ? `${magasin.nom} (${stock.quantite} unités)` : '';
      }).filter(Boolean);
      
      return `Le produit "${produitMentionne.nom}" (Réf: ${produitMentionne.reference}) a un stock total de ${totalQuantite} unités. Prix unitaire : ${produitMentionne.prix_unitaire}€. Répartition : ${magasinsAvecStock.join(', ')}.`;
    }

    // Réponses sur les fonctionnalités
    if (message.includes('comment') && message.includes('ajouter')) {
      if (message.includes('produit')) {
        return "Pour ajouter un produit, allez dans 'Produits' > 'Nouveau Produit'. Remplissez le nom, référence, catégorie, prix unitaire, seuil d'alerte et optionnellement une image.";
      }
      if (message.includes('magasin')) {
        return "Pour ajouter un magasin, allez dans 'Magasins' > 'Nouveau Magasin'. Définissez le nom, l'adresse et la position GPS sur la carte interactive.";
      }
      if (message.includes('utilisateur') || message.includes('employé')) {
        return "Pour ajouter un utilisateur, allez dans 'Utilisateurs' > 'Nouvel Utilisateur'. Saisissez le nom, prénom, email, mot de passe, rôle et magasin assigné.";
      }
    }

    // Questions sur le pointage
    if (message.includes('pointage') || message.includes('présence')) {
      const presencesAujourdhui = "Les employés peuvent pointer leur arrivée, pause et départ via géolocalisation. L'historique est consultable dans la section 'Présences'.";
      return presencesAujourdhui;
    }

    // Réponses générales
    if (message.includes('aide') || message.includes('help')) {
      return "Je peux vous renseigner sur : le nombre de magasins/produits/employés, les stocks par magasin ou produit, les alertes de stock, les catégories, et vous guider sur l'utilisation de StockPro. Posez-moi une question spécifique !";
    }

    if (message.includes('bonjour') || message.includes('salut') || message.includes('hello')) {
      return `Bonjour ${user?.prenom} ! Comment puis-je vous aider avec StockPro aujourd'hui ?`;
    }

    if (message.includes('merci') || message.includes('thanks')) {
      return "De rien ! N'hésitez pas si vous avez d'autres questions sur StockPro.";
    }

    // Réponse par défaut avec suggestions
    return `Je ne suis pas sûr de comprendre votre question. Voici quelques exemples de ce que vous pouvez me demander :
    
• "Combien y a-t-il de magasins ?"
• "Quels sont les produits disponibles ?"
• "Quel est le stock total ?"
• "Y a-t-il des alertes de stock ?"
• "Comment ajouter un produit ?"
• "Combien d'employés sont enregistrés ?"`;
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: newMessage.trim(),
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsTyping(true);

    // Simuler un délai de réponse
    setTimeout(() => {
      const botResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: generateBotResponse(userMessage.content),
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex items-start space-x-2 max-w-xs ${
              message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
            }`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                message.sender === 'user' ? 'bg-blue-600' : 'bg-gray-600'
              }`}>
                {message.sender === 'user' ? (
                  <User className="h-4 w-4 text-white" />
                ) : (
                  <Bot className="h-4 w-4 text-white" />
                )}
              </div>
              <div
                className={`px-3 py-2 rounded-lg ${
                  message.sender === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-900'
                }`}
              >
                <p className="text-sm whitespace-pre-line">{message.content}</p>
                <p className={`text-xs mt-1 ${
                  message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                }`}>
                  {message.timestamp.toLocaleTimeString('fr-FR', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="flex items-start space-x-2">
              <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center">
                <Bot className="h-4 w-4 text-white" />
              </div>
              <div className="bg-gray-200 text-gray-900 px-3 py-2 rounded-lg">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Posez votre question sur StockPro..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isTyping}
          />
          <button
            onClick={sendMessage}
            disabled={!newMessage.trim() || isTyping}
            className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};