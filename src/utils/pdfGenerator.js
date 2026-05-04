import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { format } from 'date-fns';
import QRCode from 'qrcode';

// --- Theme Colors ---
const PRIMARY_COLOR = [30, 58, 138]; // Deep Navy Blue (#1E3A8A)
const ACCENT_COLOR = [217, 119, 6]; // Premium Amber (#D97706)
const TEXT_COLOR = [30, 41, 59]; // Slate 800 (#1E293B)
const MUTED_COLOR = [100, 116, 139]; // Slate 500 (#64748B)

const loadLogo = async () => {
    return new Promise((resolve) => {
        const img = new Image();
        img.src = '/logopdf.png';
        img.crossOrigin = 'Anonymous';
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            resolve(canvas.toDataURL('image/png'));
        };
        img.onerror = () => {
            console.warn('Could not load logo image');
            resolve(null);
        };
    });
};

const drawWatermark = async (doc) => {
    const logoData = await loadLogo();
    if (logoData) {
        doc.saveGraphicsState();
        doc.setGState(new doc.GState({ opacity: 0.15 }));
        doc.addImage(logoData, 'PNG', 55, 100, 100, 100);
        doc.restoreGraphicsState();
    } else {
        doc.saveGraphicsState();
        doc.setGState(new doc.GState({ opacity: 0.05 }));
        doc.setFontSize(90);
        doc.setTextColor(PRIMARY_COLOR[0], PRIMARY_COLOR[1], PRIMARY_COLOR[2]);
        doc.setFont('helvetica', 'bold');
        doc.text('C.S. NDTG', 105, 160, { align: 'center', angle: 45 });
        doc.restoreGraphicsState();
    }
};

const drawPremiumHeader = async (doc, title, subtitle = '') => {
    // Top Accent Border
    doc.setFillColor(ACCENT_COLOR[0], ACCENT_COLOR[1], ACCENT_COLOR[2]);
    doc.rect(0, 0, 210, 5, 'F');

    // Header Background
    doc.setFillColor(248, 250, 252); // Slate 50
    doc.rect(0, 5, 210, 40, 'F');
    doc.setDrawColor(226, 232, 240); // Slate 200
    doc.setLineWidth(0.5);
    doc.line(0, 45, 210, 45);

    const logoData = await loadLogo();
    if (logoData) {
        doc.addImage(logoData, 'PNG', 14, 10, 25, 25);
        // School Name
        doc.setFontSize(12);
        doc.setTextColor(PRIMARY_COLOR[0], PRIMARY_COLOR[1], PRIMARY_COLOR[2]);
        doc.setFont('helvetica', 'bold');
        doc.text('COMPLEXE SCOLAIRE NOTRE DAME DE TOUTES GRÂCES', 43, 20);

        // School Info
        doc.setFontSize(9);
        doc.setTextColor(MUTED_COLOR[0], MUTED_COLOR[1], MUTED_COLOR[2]);
        doc.setFont('helvetica', 'normal');
        doc.text('Quartier Ayelawadje, Cotonou  |  Tél: +229 97 00 00 00  |  Email: contact@ndtg.bj', 43, 27);
    } else {
        // School Name
        doc.setFontSize(16);
        doc.setTextColor(PRIMARY_COLOR[0], PRIMARY_COLOR[1], PRIMARY_COLOR[2]);
        doc.setFont('helvetica', 'bold');
        doc.text('COMPLEXE SCOLAIRE NOTRE DAME DE TOUTES GRÂCES', 14, 20);

        // School Info
        doc.setFontSize(9);
        doc.setTextColor(MUTED_COLOR[0], MUTED_COLOR[1], MUTED_COLOR[2]);
        doc.setFont('helvetica', 'normal');
        doc.text('Quartier Ayelawadje, Cotonou  |  Tél: +229 97 00 00 00  |  Email: contact@ndtg.bj', 14, 27);
    }

    // Document Title
    doc.setFontSize(22);
    doc.setTextColor(ACCENT_COLOR[0], ACCENT_COLOR[1], ACCENT_COLOR[2]);
    doc.setFont('helvetica', 'bold');
    doc.text(title.toUpperCase(), 196, 25, { align: 'right' });

    if (subtitle) {
        doc.setFontSize(10);
        doc.setTextColor(TEXT_COLOR[0], TEXT_COLOR[1], TEXT_COLOR[2]);
        doc.setFont('helvetica', 'bold');
        doc.text(subtitle, 196, 32, { align: 'right' });
    }
};

const drawPremiumFooter = (doc, additionalText = '') => {
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        
        doc.setDrawColor(PRIMARY_COLOR[0], PRIMARY_COLOR[1], PRIMARY_COLOR[2]);
        doc.setLineWidth(1);
        doc.line(14, 282, 196, 282);

        doc.setFontSize(8);
        doc.setTextColor(MUTED_COLOR[0], MUTED_COLOR[1], MUTED_COLOR[2]);
        doc.setFont('helvetica', 'normal');
        doc.text('Ce document est certifié par le Système de Gestion NDTG.', 14, 287);
        if (additionalText) {
            doc.text(additionalText, 14, 291);
        }
        
        doc.text(`Page ${i} sur ${pageCount}`, 196, 287, { align: 'right' });
    }
};

// ============================================================================
// RECEIPT (REÇU)
// ============================================================================
export const generateReceiptPDF = async (transaction, type) => {
    const doc = new jsPDF();
    const isScolarite = type === 'scolarite';
    const ref = transaction.reference;
    const date = isScolarite ? transaction.date_paiement : transaction.date_vente;

    await drawWatermark(doc);
    await drawPremiumHeader(
        doc, 
        isScolarite ? 'REÇU DE SCOLARITÉ' : 'REÇU DE VENTE', 
        `Réf: ${ref}  |  ${format(new Date(date), 'dd/MM/yyyy HH:mm')}`
    );

    let startY = 60;

    // --- Info Boxes ---
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.5);

    // Client Box
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(14, startY, 88, 35, 3, 3, 'FD');
    doc.setFillColor(PRIMARY_COLOR[0], PRIMARY_COLOR[1], PRIMARY_COLOR[2]);
    doc.path([{op: 'm', c: [14, startY+3]}, {op: 'l', c: [14, startY+32]}, {op: 'l', c: [17, startY+32]}, {op: 'l', c: [17, startY+3]}, {op: 'h'}]);
    doc.rect(14, startY, 3, 35, 'F'); // Left accent bar

    doc.setFontSize(10);
    doc.setTextColor(MUTED_COLOR[0], MUTED_COLOR[1], MUTED_COLOR[2]);
    doc.setFont('helvetica', 'bold');
    doc.text(isScolarite ? 'INFORMATIONS ÉLÈVE' : 'INFORMATIONS CLIENT', 22, startY + 8);

    doc.setFontSize(11);
    doc.setTextColor(TEXT_COLOR[0], TEXT_COLOR[1], TEXT_COLOR[2]);
    if (transaction.eleve) {
        doc.setFont('helvetica', 'bold');
        doc.text(`${transaction.eleve.nom} ${transaction.eleve.prenom}`, 22, startY + 16);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.text(`Matricule: ${transaction.eleve.matricule}`, 22, startY + 23);
        doc.text(`Classe: ${transaction.eleve.classe?.nom || 'N/A'}`, 22, startY + 30);
    } else {
        doc.setFont('helvetica', 'bold');
        doc.text(transaction.nom_client || 'Client Anonyme', 22, startY + 16);
    }

    // Payment Box
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(108, startY, 88, 35, 3, 3, 'FD');
    doc.setFillColor(ACCENT_COLOR[0], ACCENT_COLOR[1], ACCENT_COLOR[2]);
    doc.rect(108, startY, 3, 35, 'F'); // Left accent bar

    doc.setFontSize(10);
    doc.setTextColor(MUTED_COLOR[0], MUTED_COLOR[1], MUTED_COLOR[2]);
    doc.setFont('helvetica', 'bold');
    doc.text('DÉTAILS DU RÈGLEMENT', 116, startY + 8);

    doc.setFontSize(10);
    doc.setTextColor(TEXT_COLOR[0], TEXT_COLOR[1], TEXT_COLOR[2]);
    doc.setFont('helvetica', 'normal');
    if (isScolarite) {
        doc.text(`Mode de paiement: ${transaction.methode?.toUpperCase() || 'ESPÈCES'}`, 116, startY + 16);
    }
    
    doc.text('Statut du paiement:', 116, startY + 23);
    doc.setFillColor(220, 252, 231); // Green 100
    doc.roundedRect(153, startY + 19, 20, 6, 1, 1, 'F');
    doc.setTextColor(22, 101, 52); // Green 800
    doc.setFont('helvetica', 'bold');
    doc.text('PAYÉ', 156, startY + 23.5);

    doc.setTextColor(MUTED_COLOR[0], MUTED_COLOR[1], MUTED_COLOR[2]);
    doc.setFont('helvetica', 'italic');
    const caissier = isScolarite ? 'Direction/Comptabilité' : (transaction.auteur?.last_name || 'Comptabilité');
    doc.text(`Géré par: ${caissier}`, 116, startY + 30);

    startY += 50;

    // --- Table ---
    let tableBody = [];
    if (isScolarite) {
        tableBody = [[
            transaction.contribution?.description || 'Frais de scolarité',
            transaction.contribution?.annee_scolaire || 'Année en cours',
            `${transaction.montant.toLocaleString('fr-FR')} FCFA`
        ]];
    } else {
        tableBody = transaction.lignes?.map(line => [
            line.article?.designation || 'Article Inconnu',
            line.quantite.toString(),
            `${line.prix_unitaire.toLocaleString('fr-FR')} FCFA`,
            `${line.sous_total.toLocaleString('fr-FR')} FCFA`
        ]) || [];
    }

    doc.autoTable({
        startY: startY,
        head: isScolarite ? [['Désignation', 'Période / Année', 'Montant Payé']] : [['Article', 'Quantité', 'Prix Unitaire', 'Sous-total']],
        body: tableBody,
        theme: 'grid',
        headStyles: { fillColor: PRIMARY_COLOR, textColor: 255, fontStyle: 'bold', halign: 'center' },
        bodyStyles: { textColor: TEXT_COLOR, fontSize: 10, cellPadding: 6 },
        alternateRowStyles: { fillColor: [248, 250, 252] },
        columnStyles: isScolarite ? { 2: { halign: 'right', fontStyle: 'bold' } } : { 2: { halign: 'right' }, 3: { halign: 'right', fontStyle: 'bold' } },
        margin: { left: 14, right: 14 }
    });

    // --- Total ---
    startY = doc.lastAutoTable.finalY + 10;
    const totalAmount = isScolarite ? transaction.montant : transaction.montant_total;

    doc.setFillColor(241, 245, 249); // Slate 100
    doc.roundedRect(120, startY, 76, 15, 2, 2, 'F');
    
    doc.setFontSize(12);
    doc.setTextColor(TEXT_COLOR[0], TEXT_COLOR[1], TEXT_COLOR[2]);
    doc.setFont('helvetica', 'normal');
    doc.text('TOTAL PAYÉ:', 124, startY + 10);
    
    doc.setFontSize(14);
    doc.setTextColor(PRIMARY_COLOR[0], PRIMARY_COLOR[1], PRIMARY_COLOR[2]);
    doc.setFont('helvetica', 'bold');
    doc.text(`${totalAmount.toLocaleString('fr-FR')} FCFA`, 192, startY + 10, { align: 'right' });

    // --- QR Code & Signature ---
    startY += 35;

    try {
        const qrData = JSON.stringify({ ref: ref, type: type, montant: totalAmount });
        const qrDataURL = await QRCode.toDataURL(qrData, { width: 100, margin: 0, color: { dark: '#1E293B', light: '#FFFFFF' } });
        doc.addImage(qrDataURL, 'PNG', 14, startY, 25, 25);
        doc.setFontSize(7);
        doc.setTextColor(MUTED_COLOR[0], MUTED_COLOR[1], MUTED_COLOR[2]);
        doc.text('Authentification', 26.5, startY + 28, { align: 'center' });
    } catch (err) {
        console.error('Erreur QR Code:', err);
    }

    doc.setFontSize(11);
    doc.setTextColor(TEXT_COLOR[0], TEXT_COLOR[1], TEXT_COLOR[2]);
    doc.setFont('helvetica', 'bold');
    doc.text('Cachet et Signature', 160, startY + 5, { align: 'center' });
    
    doc.setDrawColor(200, 200, 200);
    doc.setLineDash([2, 2], 0);
    doc.line(130, startY + 25, 190, startY + 25);
    doc.setLineDash([]); // Reset

    drawPremiumFooter(doc, 'Merci de conserver ce reçu précieusement.');
    doc.save(`Recu_${isScolarite ? 'Paiement' : 'Vente'}_${ref}.pdf`);
};

// ============================================================================
// FICHE DE PAIE (PAYSLIP)
// ============================================================================
export const generateFicheDePaiePDF = async (paieData, mois, annee) => {
    const doc = new jsPDF();
    const monthNames = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
    const monthName = monthNames[mois - 1];

    await drawWatermark(doc);
    await drawPremiumHeader(doc, 'FICHE DE PAIE', `Période: ${monthName} ${annee}`);

    let startY = 60;

    // --- Employee Info ---
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(ACCENT_COLOR[0], ACCENT_COLOR[1], ACCENT_COLOR[2]);
    doc.setLineWidth(0.5);
    doc.roundedRect(14, startY, 182, 30, 2, 2, 'FD');

    doc.setFontSize(10);
    doc.setTextColor(MUTED_COLOR[0], MUTED_COLOR[1], MUTED_COLOR[2]);
    doc.setFont('helvetica', 'bold');
    doc.text('INFORMATIONS EMPLOYÉ', 18, startY + 8);

    doc.setFontSize(12);
    doc.setTextColor(PRIMARY_COLOR[0], PRIMARY_COLOR[1], PRIMARY_COLOR[2]);
    doc.setFont('helvetica', 'bold');
    doc.text(`${paieData.professeur.nom} ${paieData.professeur.prenom}`, 18, startY + 16);

    doc.setFontSize(10);
    doc.setTextColor(TEXT_COLOR[0], TEXT_COLOR[1], TEXT_COLOR[2]);
    doc.setFont('helvetica', 'normal');
    doc.text(`Fonction: Professeur`, 18, startY + 24);
    doc.text(`Contact: ${paieData.professeur.telephone || 'N/A'}`, 120, startY + 16);
    doc.text(`Matricule: ${paieData.professeur.id || 'N/A'}`, 120, startY + 24);

    startY += 45;

    // --- Remuneration Details ---
    const tableBody = [];
    
    // Heures de cours
    if (paieData.details_heures && paieData.details_heures.length > 0) {
        paieData.details_heures.forEach(detail => {
            tableBody.push([
                `Rémunération cours - ${detail.classe}`,
                `${detail.heures} heures`,
                `${detail.taux.toLocaleString('fr-FR')} FCFA/h`,
                `${detail.montant.toLocaleString('fr-FR')} FCFA`
            ]);
        });
    } else {
        tableBody.push([
            'Rémunération des heures de cours',
            `${paieData.total_heures} heures`,
            '-',
            `${paieData.montant_heures.toLocaleString('fr-FR')} FCFA`
        ]);
    }

    // Primes
    if (paieData.primes_list && paieData.primes_list.length > 0) {
        paieData.primes_list.forEach(prime => {
            tableBody.push([
                `Prime: ${prime.type_prime || 'Non spécifié'}`,
                'Mensuel',
                '-',
                `+ ${prime.montant.toLocaleString('fr-FR')} FCFA`
            ]);
        });
    } else if (paieData.montant_primes > 0) {
        tableBody.push([
            'Primes & Indemnités',
            'Mensuel',
            '-',
            `+ ${paieData.montant_primes.toLocaleString('fr-FR')} FCFA`
        ]);
    }

    doc.autoTable({
        startY: startY,
        head: [['Désignation', 'Quantité / Base', 'Taux', 'Montant à payer']],
        body: tableBody,
        theme: 'striped',
        headStyles: { fillColor: PRIMARY_COLOR, textColor: 255, fontStyle: 'bold' },
        bodyStyles: { textColor: TEXT_COLOR, fontSize: 10, cellPadding: 8 },
        columnStyles: { 3: { halign: 'right', fontStyle: 'bold' } },
        margin: { left: 14, right: 14 }
    });

    startY = doc.lastAutoTable.finalY + 15;

    // --- Total ---
    doc.setFillColor(PRIMARY_COLOR[0], PRIMARY_COLOR[1], PRIMARY_COLOR[2]);
    doc.roundedRect(100, startY, 96, 18, 2, 2, 'F');
    
    doc.setFontSize(14);
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.text('SALAIRE NET À PAYER', 105, startY + 12);
    
    doc.setFontSize(16);
    doc.setTextColor(ACCENT_COLOR[0], ACCENT_COLOR[1], ACCENT_COLOR[2]);
    doc.text(`${paieData.montant_total.toLocaleString('fr-FR')} FCFA`, 190, startY + 12.5, { align: 'right' });

    // --- Signatures ---
    startY += 45;
    
    doc.setTextColor(TEXT_COLOR[0], TEXT_COLOR[1], TEXT_COLOR[2]);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Signature de l\'Employé', 50, startY, { align: 'center' });
    doc.text('La Direction', 160, startY, { align: 'center' });

    doc.setDrawColor(200, 200, 200);
    doc.setLineDash([2, 2], 0);
    doc.line(20, startY + 20, 80, startY + 20);
    doc.line(130, startY + 20, 190, startY + 20);
    doc.setLineDash([]); // Reset

    drawPremiumFooter(doc, 'Pour toute réclamation, veuillez contacter la direction dans un délai de 7 jours.');
    doc.save(`Fiche_Paie_${paieData.professeur.nom.replace(/\s+/g, '_')}_${monthName}_${annee}.pdf`);
};

// ============================================================================
// BULLETIN DE NOTES (REPORT CARD)
// ============================================================================
export const generateBulletinPDF = async (data, trimestre) => {
    const doc = new jsPDF();
    const eleve = data.eleve;

    await drawWatermark(doc);
    await drawPremiumHeader(doc, `BULLETIN DE NOTES`, `TRIMESTRE ${trimestre} - ${eleve.annee_scolaire || 'Année en cours'}`);

    let startY = 55;

    // --- Student Info Block ---
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.5);
    doc.roundedRect(14, startY, 182, 35, 3, 3, 'FD');
    doc.setFillColor(PRIMARY_COLOR[0], PRIMARY_COLOR[1], PRIMARY_COLOR[2]);
    doc.rect(14, startY, 4, 35, 'F'); // Left accent

    doc.setFontSize(14);
    doc.setTextColor(PRIMARY_COLOR[0], PRIMARY_COLOR[1], PRIMARY_COLOR[2]);
    doc.setFont('helvetica', 'bold');
    doc.text(`${eleve.nom} ${eleve.prenom}`, 24, startY + 12);

    doc.setFontSize(10);
    doc.setTextColor(TEXT_COLOR[0], TEXT_COLOR[1], TEXT_COLOR[2]);
    doc.setFont('helvetica', 'normal');
    doc.text(`Matricule :`, 24, startY + 22);
    doc.setFont('helvetica', 'bold');
    doc.text(`${eleve.matricule}`, 45, startY + 22);

    doc.setFont('helvetica', 'normal');
    doc.text(`Classe :`, 24, startY + 29);
    doc.setFont('helvetica', 'bold');
    doc.text(`${eleve.classe?.nom || 'N/A'}`, 45, startY + 29);

    doc.setFont('helvetica', 'normal');
    doc.text(`Effectif de classe :`, 120, startY + 22);
    doc.setFont('helvetica', 'bold');
    doc.text(`${data.effectif_classe || 0} élèves`, 152, startY + 22);

    startY += 45;

    // --- Grades Table ---
    const tableBody = data.notes.map(n => [
        n.matiere?.nom || 'Matière',
        n.moyenne_trimestrielle || '-',
        n.coefficient || 1,
        ((n.moyenne_trimestrielle || 0) * (n.coefficient || 1)).toFixed(2),
        n.rang_matiere || '-'
    ]);

    doc.autoTable({
        startY: startY,
        head: [['Matière', 'Moyenne /20', 'Coef.', 'Moy x Coef', 'Rang']],
        body: tableBody,
        theme: 'grid',
        headStyles: { fillColor: PRIMARY_COLOR, textColor: 255, fontStyle: 'bold', halign: 'center' },
        bodyStyles: { textColor: TEXT_COLOR, fontSize: 10, cellPadding: 5 },
        columnStyles: { 
            0: { fontStyle: 'bold' },
            1: { halign: 'center', textColor: PRIMARY_COLOR }, 
            2: { halign: 'center', textColor: MUTED_COLOR }, 
            3: { halign: 'center', fontStyle: 'bold' }, 
            4: { halign: 'center' } 
        },
        alternateRowStyles: { fillColor: [248, 250, 252] },
        margin: { left: 14, right: 14 }
    });

    let finalY = doc.lastAutoTable.finalY + 15;

    // --- Results Block ---
    doc.setFillColor(255, 251, 235); // Amber 50
    doc.setDrawColor(ACCENT_COLOR[0], ACCENT_COLOR[1], ACCENT_COLOR[2]);
    doc.setLineWidth(0.5);
    doc.roundedRect(14, finalY, 182, 25, 2, 2, 'FD');

    doc.setFontSize(12);
    doc.setTextColor(TEXT_COLOR[0], TEXT_COLOR[1], TEXT_COLOR[2]);
    doc.setFont('helvetica', 'bold');
    doc.text(`Moyenne Générale :`, 20, finalY + 10);
    
    doc.setFontSize(16);
    doc.setTextColor(PRIMARY_COLOR[0], PRIMARY_COLOR[1], PRIMARY_COLOR[2]);
    doc.text(`${Number(data.moyenne_generale).toFixed(2)} / 20`, 65, finalY + 10);

    doc.setFontSize(12);
    doc.setTextColor(TEXT_COLOR[0], TEXT_COLOR[1], TEXT_COLOR[2]);
    doc.text(`Rang :`, 130, finalY + 10);
    
    doc.setFontSize(16);
    doc.setTextColor(ACCENT_COLOR[0], ACCENT_COLOR[1], ACCENT_COLOR[2]);
    doc.text(`${data.rang}${data.rang === 1 ? 'er' : 'ème'}`, 145, finalY + 10);

    if (data.moyenne_annuelle) {
        doc.setFontSize(11);
        doc.setTextColor(MUTED_COLOR[0], MUTED_COLOR[1], MUTED_COLOR[2]);
        doc.text(`Moyenne Annuelle: ${Number(data.moyenne_annuelle).toFixed(2)} / 20`, 20, finalY + 20);
    }

    finalY += 45;

    // --- QR Code & Direction ---
    try {
        const qrData = JSON.stringify({ id: eleve.id, nom: eleve.nom, trim: trimestre, moy: Number(data.moyenne_generale).toFixed(2) });
        const qrDataURL = await QRCode.toDataURL(qrData, { width: 100, margin: 0 });
        doc.addImage(qrDataURL, 'PNG', 14, finalY - 5, 25, 25);
    } catch (err) {
        console.error('Erreur QR Code:', err);
    }

    doc.setFontSize(11);
    doc.setTextColor(TEXT_COLOR[0], TEXT_COLOR[1], TEXT_COLOR[2]);
    doc.setFont('helvetica', 'bold');
    doc.text('Le Chef d\'Établissement', 150, finalY, { align: 'center' });

    drawPremiumFooter(doc, 'Décision du Conseil des Professeurs au dos du document ou transmise séparément.');
    doc.save(`Bulletin_${eleve.nom}_${eleve.prenom}_T${trimestre}.pdf`);
};
