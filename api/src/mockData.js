// Mock data storage
const mockData = {
  users: [
    {
      userId: 1,
      email: 'tram@ncsu.edu',
      password: 'password123',
      name: 'Tram Nguyen',
      isActive: true
    },
    {
      userId: 2,
      email: 'trish@ncsu.edu',
      password: 'password123',
      name: 'Trish Nguyen',
      isActive: true
    },
    {
      userId: 3,
      email: 'raina@ncsu.edu',
      password: 'password123',
      name: 'Raina Yowell',
      isActive: true
    }
  ],
  businesses: [
    {
      businessId: 1,
      id: 'the-pit',
      name: 'The Pit Barbecue',
      address: '328 W Davie St, Raleigh, NC 27601',
      category: 'Restaurants',
      phone: '(919) 747-0525',
      image: 'the-pit.jpg',
      description: 'Award-winning barbecue restaurant',
      about: 'Award-winning barbecue restaurant serving slow-smoked meats and classic sides.',
      rating: 4.8,
      distanceMi: 0.5,
      hours: 'Mon-Thu: 11am–9pm, Fri-Sat: 11am–10pm, Sun: 12pm–8pm'
    },
    {
      businessId: 2,
      id: 'brewing-station',
      name: 'Brewing Station',
      address: '404 W Martin St, Raleigh, NC 27601',
      category: 'Beverages',
      phone: '(919) 821-1111',
      image: 'brewing-station.jpg',
      description: 'Craft coffee and espresso bar',
      about: 'Specialty coffee roastery and espresso bar with pastries and light breakfast.',
      rating: 4.5,
      distanceMi: 0.6,
      hours: 'Daily: 7am–6pm'
    },
    {
      businessId: 3,
      id: 'glowing-skin',
      name: 'Glowing Skin Studio',
      address: '123 Fayetteville St, Raleigh, NC 27601',
      category: 'Beauty',
      phone: '(919) 555-1234',
      image: 'glowing-skin.jpg',
      description: 'Full-service beauty and wellness spa',
      about: 'Full-service spa offering facials, skincare treatments, and wellness services.',
      rating: 4.9,
      distanceMi: 1.2,
      hours: 'Tue-Sat: 10am–7pm, Sun-Mon: Closed'
    },
    {
      businessId: 4,
      id: 'style-seam',
      name: 'Style & Seam',
      address: '200 Fayetteville St, Raleigh, NC 27601',
      category: 'Clothing',
      phone: '(919) 555-5678',
      image: 'style-seam.jpg',
      description: 'Boutique clothing and accessories',
      about: 'Curated boutique featuring clothing and accessories from local designers.',
      rating: 4.6,
      distanceMi: 0.8,
      hours: 'Mon-Sat: 10am–8pm, Sun: 12pm–6pm'
    },
    {
      businessId: 5,
      id: 'luna-cafe',
      name: 'Luna Cafe',
      address: '234 Fayetteville St, Raleigh, NC 27601',
      category: 'Beverages',
      phone: '(919) 555-9999',
      image: 'luna-cafe.jpg',
      description: 'Cozy cafe with amazing pastries',
      about: 'Cozy neighborhood cafe known for fresh pastries and artisan coffee drinks.',
      rating: 4.7,
      distanceMi: 0.7,
      hours: 'Daily: 7am–7pm'
    },
    {
      businessId: 6,
      id: 'wellness-hair',
      name: 'Wellness Hair & Nails',
      address: '150 Fayetteville St, Raleigh, NC 27601',
      category: 'Beauty',
      phone: '(919) 555-2468',
      image: 'wellness-hair.jpg',
      description: 'Professional hair and nail services',
      about: 'Professional salon offering hair styling, coloring, and nail services.',
      rating: 4.4,
      distanceMi: 1.0,
      hours: 'Tue-Sat: 9am–6pm, Sun-Mon: Closed'
    }
  ],
  reviews: [
    {
      reviewId: 1,
      businessId: 1,
      userId: 1,
      rating: 5,
      comment: 'Best barbecue in Raleigh!',
      date: '2024-03-10'
    },
    {
      reviewId: 2,
      businessId: 1,
      userId: 2,
      rating: 4,
      comment: 'Great food, but a bit pricey',
      date: '2024-03-09'
    },
    {
      reviewId: 3,
      businessId: 2,
      userId: 3,
      rating: 5,
      comment: 'Amazing coffee! Will come back',
      date: '2024-03-08'
    }
  ],
  events: [
    {
      eventId: 1,
      id: 'networking-night',
      title: 'Women Entrepreneurs Networking Night',
      name: 'Women Entrepreneurs Networking Night',
      date: '2024-04-15',
      time: '18:00',
      location: 'The Pit Barbecue, Raleigh, NC',
      address: 'The Pit Barbecue, Raleigh, NC',
      description: 'Meet local female business owners and entrepreneurs',
      details: 'Meet local female business owners and entrepreneurs',
      category: 'Networking',
      attendees: 45
    },
    {
      eventId: 2,
      id: 'self-care-workshop',
      title: 'Self-Care Workshop',
      name: 'Self-Care Workshop',
      date: '2024-04-20',
      time: '14:00',
      location: 'Glowing Skin Studio, Raleigh, NC',
      address: 'Glowing Skin Studio, Raleigh, NC',
      description: 'Learn about self-care practices and wellness tips',
      details: 'Learn about self-care practices and wellness tips',
      category: 'Wellness',
      attendees: 30
    },
    {
      eventId: 3,
      id: 'fashion-show',
      title: 'Fashion Show & Trunk Sale',
      name: 'Fashion Show & Trunk Sale',
      date: '2024-04-22',
      time: '19:00',
      location: 'Style & Seam, Raleigh, NC',
      address: 'Style & Seam, Raleigh, NC',
      description: 'Spring fashion showcase and trunk sale',
      details: 'Spring fashion showcase and trunk sale',
      category: 'Shopping',
      attendees: 60
    }
  ],
  userFavorites: [
    {
      userId: 1,
      businessId: 1,
      dateSaved: '2024-03-01'
    },
    {
      userId: 1,
      businessId: 3,
      dateSaved: '2024-03-02'
    },
    {
      userId: 2,
      businessId: 2,
      dateSaved: '2024-03-03'
    }
  ],
  userEventSaves: [
    {
      userId: 1,
      eventId: 1,
      dateSaved: '2024-03-15'
    },
    {
      userId: 2,
      eventId: 2,
      dateSaved: '2024-03-16'
    },
    {
      userId: 3,
      eventId: 3,
      dateSaved: '2024-03-17'
    }
  ],
  submissions: [
    {
      submissionId: 1,
      name: 'New Boutique Coffee',
      address: '500 Fayetteville St, Raleigh, NC',
      category: 'Beverages',
      contactEmail: 'owner@cafe.com',
      contactPhone: '(919) 555-1111',
      status: 'pending',
      submittedDate: '2024-03-05'
    },
    {
      submissionId: 2,
      name: 'Artisan Clothing Co',
      address: '300 Fayetteville St, Raleigh, NC',
      category: 'Clothing',
      contactEmail: 'info@artisan.com',
      contactPhone: '(919) 555-2222',
      status: 'approved',
      submittedDate: '2024-03-01'
    }
  ],
  nextUserId: 4,
  nextBusinessId: 7,
  nextReviewId: 4,
  nextEventId: 4,
  nextSubmissionId: 3
};

module.exports = mockData;
