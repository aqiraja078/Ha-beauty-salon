# 📸 ALL IMAGES IN CANVAS LUXURY SALON APPLICATION

**Complete list of all images with their current links and suggestions for making them clickable**

---

## 🏠 HOMEPAGE IMAGES

### 1. Hero Background Image
**File:** `src/components/home/HomeHeroAnimated.tsx`
**Current Link:** `https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1920&q=85`
**Usage:** Hero section background
**Suggestion:** Make clickable to link to services or portfolio

### 2. Gallery Images (HomeSections.tsx)
**File:** `src/components/home/HomeSections.tsx`
**Current Links:**
```javascript
const galleryImages = [
  "https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=600&q=80", // Makeup
  "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&q=80", // Hair
  "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=600&q=80", // Bridal
  "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=600&q=80", // Facial
  "https://images.unsplash.com/photo-1519415943484-9fa1873496d4?w=600&q=80", // Nails
  "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=600&q=80", // Mehndi
];
```
**Suggestion:** Make each gallery image clickable to link to respective service pages

---

## 🛍️ SERVICE PAGES HERO IMAGES

### 3. Hair Services Page
**File:** `src/app/services/hair/page.tsx`
**Current Link:** `https://images.unsplash.com/photo-1562322140-8baeececf3df?w=1400&q=80`
**Usage:** Hair services hero background
**Suggestion:** Make clickable to scroll to services list or link to booking

### 4. Facial Services Page
**File:** `src/app/services/facial/page.tsx`
**Current Link:** `https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=1400&q=80`
**Usage:** Facial services hero background
**Suggestion:** Make clickable to scroll to services list or link to booking

### 5. Body Spa Services Page
**File:** `src/app/services/body-spa/page.tsx`
**Current Link:** `https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=1400&q=80`
**Usage:** Body spa services hero background
**Suggestion:** Make clickable to scroll to services list or link to booking

### 6. Nails Services Page
**File:** `src/app/services/nails/page.tsx`
**Current Link:** `https://i.pinimg.com/1200x/02/ea/e1/02eae1fc1f0e7c9f4bfa52ee8347a941.jpg`
**Usage:** Nails services hero background
**Suggestion:** Make clickable to scroll to services list or link to booking

### 7. Mehndi Services Page
**File:** `src/app/services/mehndi/page.tsx`
**Current Link:** `https://i.pinimg.com/736x/ae/84/5f/ae845fba0f519d795710e90bf6a866ec.jpg`
**Usage:** Mehndi services hero background
**Suggestion:** Make clickable to scroll to services list or link to booking

---

## 📂 SERVICE CATEGORY IMAGES (site.ts)

### 8. Service Categories
**File:** `src/lib/site.ts`
**Current Links:**
```javascript
export const serviceCategories = [
  {
    slug: "hair",
    title: "Hair",
    image: "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=900&q=85",
  },
  {
    slug: "facial",
    title: "Facial",
    image: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=900&q=85",
  },
  {
    slug: "body-spa",
    title: "Body & spa",
    image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=900&q=85",
  },
  {
    slug: "nails",
    title: "Mani, pedi & nails",
    image: "https://images.unsplash.com/photo-1519014814348-9c6079d4ca79?w=900&q=85",
  },
  {
    slug: "mehndi",
    title: "Mehndi",
    image: "https://images.unsplash.com/photo-1614204424926-65644c7833a7?w=900&q=85",
  },
  {
    slug: "makeup",
    title: "Makeup",
    image: "https://i.pinimg.com/1200x/68/64/65/68646592ddaac1f191d4100112a100e5.jpg?w=900&q=85",
  },
];
```
**Suggestion:** These are already clickable - they link to respective service pages

---

## 💄 MAKEUP SERVICE IMAGES (makeup-home-cards.ts)

### 9. Makeup Service Cards
**File:** `src/lib/makeup-home-cards.ts`
**Current Links:**
```javascript
export const homeMakeupCards = [
  {
    title: "Bridal Makeup",
    image: "https://i.pinimg.com/1200x/68/64/65/68646592ddaac1f191d4100112a100e5.jpg?w=800&q=85",
  },
  {
    title: "Party / Event Makeup",
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&q=85",
  },
  {
    title: "Hair Color & Styling",
    image: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=800&q=85",
  },
  {
    title: "Facial Treatment",
    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=85",
  },
];
```
**Suggestion:** These are already clickable - they link to booking page

---

## 🎨 PORTFOLIO GALLERY IMAGES

### 10. Portfolio Page Gallery
**File:** `src/app/portfolio/page.tsx`
**Current Links:**
```javascript
const portfolioImages = [
  "https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=800&q=80",
  "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80",
  "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=800&q=80",
  "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=800&q=80",
  "https://images.unsplash.com/photo-1519415943484-9fa1873496d4?w=800&q=80",
  "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=800&q=80",
  "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&q=80",
  "https://images.unsplash.com/photo-1633681926022-84c23e8cb2d6?w=800&q=80",
];
```
**Suggestion:** Make each portfolio image clickable to open in lightbox or link to booking

---

## 🔗 HOW TO MAKE IMAGES CLICKABLE

### Option 1: Wrap Images in Link Components
```jsx
<Link href="/services/hair">
  <Image src={imageUrl} alt="Hair Services" />
</Link>
```

### Option 2: Add onClick handlers
```jsx
<Image
  src={imageUrl}
  alt="Hair Services"
  onClick={() => router.push('/services/hair')}
  className="cursor-pointer"
/>
```

### Option 3: Add overlay with link
```jsx
<div className="relative">
  <Image src={imageUrl} alt="Hair Services" />
  <Link href="/services/hair" className="absolute inset-0">
    <span className="sr-only">View Hair Services</span>
  </Link>
</div>
```

---

## 📋 RECOMMENDED CHANGES

### High Priority (User Experience)
1. **Gallery Images** → Link to respective service pages
2. **Portfolio Images** → Open in lightbox or link to booking
3. **Service Hero Images** → Link to booking page

### Medium Priority (Navigation)
4. **Hero Background** → Link to services overview
5. **Service Category Images** → Already clickable ✅

### Low Priority (Enhancement)
6. **Makeup Cards** → Already clickable ✅

---

## 🛠️ IMPLEMENTATION PLAN

Would you like me to implement clickable links for any of these images? Which ones would you like me to make clickable first?

**Quick Implementation Options:**
- **Gallery images** → Link to services
- **Portfolio images** → Lightbox modal
- **Hero images** → Link to booking
- **All images** → Comprehensive update

Let me know which images you'd like me to make clickable! 🎯