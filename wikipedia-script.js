// Wikipedia-style JavaScript functionality
document.addEventListener('DOMContentLoaded', function() {
    
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.sidebar a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Search functionality (basic simulation)
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    
    function performSearch() {
        const searchTerm = searchInput.value.trim();
        if (searchTerm) {
            // Simulate search by highlighting matching text
            highlightSearchTerm(searchTerm);
        }
    }

    searchButton.addEventListener('click', performSearch);
    
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });

    // Function to highlight search terms in the content
    function highlightSearchTerm(term) {
        // Remove previous highlights
        removeHighlights();
        
        if (!term) return;
        
        const content = document.querySelector('.content');
        const walker = document.createTreeWalker(
            content,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );
        
        const textNodes = [];
        let node;
        
        while (node = walker.nextNode()) {
            textNodes.push(node);
        }
        
        textNodes.forEach(textNode => {
            const parent = textNode.parentNode;
            if (parent.tagName === 'SCRIPT' || parent.tagName === 'STYLE') return;
            
            const text = textNode.textContent;
            const regex = new RegExp(`(${term})`, 'gi');
            
            if (regex.test(text)) {
                const highlightedHTML = text.replace(regex, '<mark class="search-highlight">$1</mark>');
                const wrapper = document.createElement('span');
                wrapper.innerHTML = highlightedHTML;
                parent.replaceChild(wrapper, textNode);
            }
        });
        
        // Scroll to first highlight
        const firstHighlight = document.querySelector('.search-highlight');
        if (firstHighlight) {
            firstHighlight.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        }
    }

    // Function to remove search highlights
    function removeHighlights() {
        const highlights = document.querySelectorAll('.search-highlight');
        highlights.forEach(highlight => {
            const parent = highlight.parentNode;
            parent.replaceChild(document.createTextNode(highlight.textContent), highlight);
            parent.normalize();
        });
    }

    // Add CSS for search highlights
    const style = document.createElement('style');
    style.textContent = `
        .search-highlight {
            background-color: #ffff99;
            padding: 2px 4px;
            border-radius: 2px;
            font-weight: bold;
        }
    `;
    document.head.appendChild(style);

    // Add active state to sidebar links
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.sidebar a[href^="#"]');
        
        let currentSection = '';
        
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            if (rect.top <= 100 && rect.bottom >= 100) {
                currentSection = section.id;
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + currentSection) {
                link.classList.add('active');
            }
        });
    }

    // Update active nav link on scroll
    window.addEventListener('scroll', updateActiveNavLink);
    
    // Add CSS for active nav links
    const navStyle = document.createElement('style');
    navStyle.textContent = `
        .sidebar a.active {
            background-color: #0645ad;
            color: white;
            font-weight: bold;
        }
        
        .sidebar a.active:hover {
            background-color: #0645ad;
            color: white;
        }
    `;
    document.head.appendChild(navStyle);

    // Initialize active nav link
    updateActiveNavLink();

    // Add print functionality
    function addPrintStyles() {
        const printStyle = document.createElement('style');
        printStyle.media = 'print';
        printStyle.textContent = `
            @media print {
                .header, .sidebar {
                    display: none !important;
                }
                
                .container {
                    flex-direction: column;
                    max-width: none;
                    padding: 0;
                }
                
                .main-content {
                    border: none;
                    box-shadow: none;
                    padding: 20px;
                }
                
                .infobox {
                    float: none;
                    width: 100%;
                    margin: 0 0 20px 0;
                    page-break-inside: avoid;
                }
                
                a {
                    color: #000 !important;
                    text-decoration: none !important;
                }
                
                .reference {
                    display: none;
                }
            }
        `;
        document.head.appendChild(printStyle);
    }

    addPrintStyles();

    console.log('Wikipedia-style page loaded successfully!');
});

