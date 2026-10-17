
const dateInput = document.getElementById('dateInput');
const searchBtn = document.getElementById('searchBtn');
const titleElement = document.getElementById('title');
const explanationElement = document.getElementById('explanation');
const img = document.getElementById('nasaImage');

async function showApod(date) {
    const query = date ? `&date=${encodeURIComponent(date)}` : '';
    const url = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&thumbs=true${query}`;

    searchBtn.disabled = true;
    titleElement.textContent = 'Φόρτωση της εικόνας της ημέρας...';
    explanationElement.textContent = '';
    img.style.display = 'none';
    try {
        const response = await fetch(url);
        if (!response.ok) {
            const details = await response.json().catch(() => ({}));
            throw new Error(details.error?.message || `NASA API error (${response.status})`);
        }

        const data = await response.json();
        titleElement.textContent = data.title || 'NASA Image';
        explanationElement.textContent = data.explanation || 'Δεν υπάρχει διαθέσιμη περιγραφή.';

        const imageUrl = data.media_type === 'image' ? (data.hdurl || data.url) : data.thumbnail_url;
        if (imageUrl) {
            img.onload = () => {
                img.style.display = 'block';
            };
            img.onerror = () => {
                img.style.display = 'none';
                explanationElement.textContent = 'Η εικόνα της NASA δεν ήταν δυνατό να φορτωθεί.';
            };
            document.getElementById('searchBtn').addEventListener('click', () => {
    const date = document.getElementById('dateInput').value;
    showApod(date);
});

            img.src = imageUrl;
            img.alt = data.title || 'NASA Astronomy Picture of the Day';
        } else {
            img.removeAttribute('src');
            explanationElement.textContent += ' Δεν υπάρχει διαθέσιμη εικόνα για αυτήν την ανάρτηση.';
        }
    } catch (error) {
        console.error('Σφάλμα:', error);
        titleElement.textContent = 'Δεν ήταν δυνατή η φόρτωση της εικόνας της ημέρας.';
        explanationElement.textContent = error.message || 'Έλεγξε τη σύνδεσή σου και δοκίμασε ξανά.';
        img.style.display = 'none';
    } finally {
        searchBtn.disabled = false;
    }
}

searchBtn.addEventListener('click', () => {
    if (!dateInput.value) {
        alert('Παρακαλώ επίλεξε μια ημερομηνία!');
        return;
    }

    showApod(dateInput.value);
});

const now = new Date();
const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
dateInput.value = today;
dateInput.max = today;
showApod();
