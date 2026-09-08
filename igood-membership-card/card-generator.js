/**
 * Card Generator Engine for iGood Apple Store Kebumen
 * Generates ultra high-resolution (1050x662) digital membership cards (Front & Back)
 */

const CardGenerator = {
  // Standar CR-80 card ratio (1050 x 662 px)
  WIDTH: 1050,
  HEIGHT: 662,
  RADIUS: 42,

  // Render Sisi Depan Kartu
  renderFront(data) {
    const canvas = document.createElement('canvas');
    canvas.width = this.WIDTH;
    canvas.height = this.HEIGHT;
    const ctx = canvas.getContext('2d');

    // 1. Base Dark Titanium Gradient Background
    const bgGrad = ctx.createLinearGradient(0, 0, this.WIDTH, this.HEIGHT);
    bgGrad.addColorStop(0, '#1c1e28');
    bgGrad.addColorStop(0.5, '#0e0f14');
    bgGrad.addColorStop(1, '#171822');
    
    this.roundRect(ctx, 0, 0, this.WIDTH, this.HEIGHT, this.RADIUS);
    ctx.fillStyle = bgGrad;
    ctx.fill();

    // 2. Radial Brushed Metallic Highlight
    const radialGrad = ctx.createRadialGradient(
      this.WIDTH * 0.75, this.HEIGHT * 0.25, 20,
      this.WIDTH * 0.75, this.HEIGHT * 0.25, this.WIDTH * 0.7
    );
    radialGrad.addColorStop(0, 'rgba(223, 183, 108, 0.18)');
    radialGrad.addColorStop(0.6, 'rgba(223, 183, 108, 0.02)');
    radialGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = radialGrad;
    ctx.fill();

    // Border Glow halus
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.lineWidth = 3;
    ctx.stroke();

    // 3. Header - Brand Logo & Name
    ctx.save();
    // Apple icon placeholder / text
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 44px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('iGood', 60, 95);

    ctx.fillStyle = '#dfb76c';
    ctx.fillText('Apple Store Kebumen', 195, 95);

    // Badge "PRIORITY CARE MEMBER"
    this.drawBadge(ctx, 60, 120, 'PRIORITY CARE MEMBER', '#dfb76c', 'rgba(223, 183, 108, 0.16)');

    // 4. EMV Chip Icon
    this.drawChip(ctx, 60, 205, 100, 75);

    // 5. NFC Wave Contactless Icon
    this.drawNfcIcon(ctx, 185, 240);

    // 6. Data Member
    // Label Name
    ctx.fillStyle = '#86868b';
    ctx.font = '600 20px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('CARDHOLDER NAME', 60, 480);

    // Member Name Value
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 36px "Plus Jakarta Sans", sans-serif';
    const cleanName = (data.name || 'NAMA MEMBER').toUpperCase();
    ctx.fillText(cleanName, 60, 525);

    // Member ID Value
    ctx.fillStyle = '#dfb76c';
    ctx.font = '700 26px "Space Grotesk", monospace';
    ctx.fillText(data.memberId || 'IG-KBM-2026-0001', 60, 570);

    // Validity
    ctx.fillStyle = '#86868b';
    ctx.font = '500 20px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(`VALID: ${data.validity || '09/26 - 09/27'}`, 60, 605);

    // 7. QR Code di Sudut Kanan Bawah
    if (data.qrImage) {
      ctx.save();
      // Kotak putih pelindung QR
      this.roundRect(ctx, this.WIDTH - 210, this.HEIGHT - 210, 150, 150, 16);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
      ctx.drawImage(data.qrImage, this.WIDTH - 200, this.HEIGHT - 200, 130, 130);
      ctx.restore();
    }

    ctx.restore();
    return canvas;
  },

  // Render Sisi Belakang Kartu
  renderBack(data) {
    const canvas = document.createElement('canvas');
    canvas.width = this.WIDTH;
    canvas.height = this.HEIGHT;
    const ctx = canvas.getContext('2d');

    // 1. Background
    this.roundRect(ctx, 0, 0, this.WIDTH, this.HEIGHT, this.RADIUS);
    ctx.fillStyle = '#101117';
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.lineWidth = 3;
    ctx.stroke();

    // 2. Magnetic Stripe
    ctx.fillStyle = '#050608';
    ctx.fillRect(0, 50, this.WIDTH, 90);

    // 3. Digital Signature Area
    const sigBoxX = 60;
    const sigBoxY = 175;
    const sigBoxW = this.WIDTH - 120;
    const sigBoxH = 85;

    this.roundRect(ctx, sigBoxX, sigBoxY, sigBoxW, sigBoxH, 10);
    ctx.fillStyle = '#f0f0f3';
    ctx.fill();

    // Label Signature
    ctx.fillStyle = '#66666e';
    ctx.font = '600 16px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('AUTHORIZED SIGNATURE / TANDA TANGAN DIGITAL RESMI', sigBoxX + 16, sigBoxY + 24);

    // Draw Signature Image from Canvas
    if (data.signatureImage) {
      ctx.drawImage(data.signatureImage, sigBoxX + 30, sigBoxY + 28, 260, 50);
    }

    // Security stamp right side
    ctx.fillStyle = '#86868b';
    ctx.font = 'bold 18px monospace';
    ctx.fillText('VERIFIED 25K', sigBoxX + sigBoxW - 160, sigBoxY + 52);

    // 4. Benefit Box
    const bBoxX = 60;
    const bBoxY = 285;
    const bBoxW = this.WIDTH - 120;
    const bBoxH = 220;

    this.roundRect(ctx, bBoxX, bBoxY, bBoxW, bBoxH, 16);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Judul Benefit
    ctx.fillStyle = '#dfb76c';
    ctx.font = 'bold 22px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('KEUNTUNGAN RESMI MEMBER iGOOD KEBUMEN:', bBoxX + 24, bBoxY + 42);

    // Benefit 1
    ctx.fillStyle = '#ffffff';
    ctx.font = '600 20px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('🛡️  Garansi Servis Mesin (Human/User Error)', bBoxX + 24, bBoxY + 86);
    ctx.fillStyle = '#dfb76c';
    ctx.font = 'bold 20px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('DISKON 5% - 15%', bBoxX + bBoxW - 200, bBoxY + 86);

    ctx.fillStyle = '#86868b';
    ctx.font = '400 16px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('Khusus unit yang terdaftar dibeli di iGood Apple Store Kebumen', bBoxX + 64, bBoxY + 114);

    // Benefit 2
    ctx.fillStyle = '#ffffff';
    ctx.font = '600 20px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('🎁  Program Referral Pembeli Baru Toko', bBoxX + 24, bBoxY + 158);
    ctx.fillStyle = '#dfb76c';
    ctx.font = 'bold 20px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('REWARD RP 25.000', bBoxX + bBoxW - 220, bBoxY + 158);

    ctx.fillStyle = '#86868b';
    ctx.font = '400 16px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('Bonus tunai/potongan setiap membawa teman yang membeli unit baru', bBoxX + 64, bBoxY + 186);

    // 5. Store Address & Disclaimer Footer
    ctx.fillStyle = '#a1a1a6';
    ctx.font = '500 17px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('iGood Apple Store Kebumen | Layanan Resmi & Konsultasi Gadget Kebumen', this.WIDTH / 2, 545);

    ctx.fillStyle = '#6e6e73';
    ctx.font = '400 14px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('Masa aktif kartu 1 tahun sejak pendaftaran. Tunjukkan kartu ini saat klaim garansi & transaksi referral.', this.WIDTH / 2, 578);
    ctx.textAlign = 'left';

    return canvas;
  },

  // Helper: Rounded Rectangle
  roundRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  },

  // Helper: Badge
  drawBadge(ctx, x, y, text, color, bgColor) {
    ctx.save();
    ctx.font = 'bold 15px "Plus Jakarta Sans", sans-serif';
    const textWidth = ctx.measureText(text).width;
    const padX = 14;
    const padY = 7;
    const w = textWidth + padX * 2;
    const h = 30;

    this.roundRect(ctx, x, y, w, h, 15);
    ctx.fillStyle = bgColor;
    ctx.fill();
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.2;
    ctx.stroke();

    ctx.fillStyle = color;
    ctx.fillText(text, x + padX, y + 20);
    ctx.restore();
  },

  // Helper: Draw EMV Chip
  drawChip(ctx, x, y, w, h) {
    ctx.save();
    this.roundRect(ctx, x, y, w, h, 12);
    const chipGrad = ctx.createLinearGradient(x, y, x + w, y + h);
    chipGrad.addColorStop(0, '#e5c378');
    chipGrad.addColorStop(0.5, '#f5e2ad');
    chipGrad.addColorStop(1, '#b38e40');
    ctx.fillStyle = chipGrad;
    ctx.fill();

    // Chip Lines
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x, y + h * 0.5);
    ctx.lineTo(x + w, y + h * 0.5);
    ctx.moveTo(x + w * 0.35, y);
    ctx.lineTo(x + w * 0.35, y + h);
    ctx.moveTo(x + w * 0.65, y);
    ctx.lineTo(x + w * 0.65, y + h);
    ctx.stroke();
    ctx.restore();
  },

  // Helper: Draw NFC Wave
  drawNfcIcon(ctx, x, y) {
    ctx.save();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';

    for (let i = 1; i <= 3; i++) {
      ctx.beginPath();
      ctx.arc(x, y, i * 11, -0.6 * Math.PI, 0.6 * Math.PI);
      ctx.stroke();
    }
    ctx.restore();
  }
};
