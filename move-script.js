// <!-- JS: Move FAQ and generate JSON-LD -->
(function initFAQ() {
  const faq = document.querySelector("#faq-section");
  if (!faq) return;

  function moveFAQ() {
    const productsContainer = document.querySelector(".category-products-UCL");
    if (!productsContainer) return false;

    if (faq.dataset.moved === "true") return true;

    // Move FAQ below products container
    productsContainer.insertAdjacentElement("afterend", faq);
    faq.dataset.moved = "true";
    faq.style.display = "block";

    console.log("FAQ section moved successfully");

    // Generate dynamic JSON-LD
    const faqItems = faq.querySelectorAll(".faq-item");
    if (faqItems.length) {
      const faqData = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [],
      };

      faqItems.forEach((item) => {
        const question = item.querySelector(".faq-question span").textContent.trim();
        let answerEl = item.querySelector(".faq-answer p");
        if (!answerEl) {
          // fallback: take all text in .faq-answer
          answerEl = item.querySelector(".faq-answer");
        }
        const answer = answerEl ? answerEl.textContent.trim() : "";
        //   const answer = item.querySelector(".faq-answer p").textContent.trim();

        if (question && answer) {
          faqData.mainEntity.push({
            "@type": "Question",
            name: question,
            acceptedAnswer: {
              "@type": "Answer",
              text: answer,
            },
          });
        }
      });

      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.text = JSON.stringify(faqData);
      document.head.appendChild(script);

      console.log("FAQ structured data added");
    }

    return true;
  }

  // Try to move immediately
  if (!moveFAQ()) {
    const observer = new MutationObserver(() => {
      if (moveFAQ()) observer.disconnect();
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  // Re-run on Magento SPA/AJAX-like events
  document.addEventListener("contentUpdated", moveFAQ);
  document.addEventListener("page:loaded", moveFAQ);
  document.addEventListener("product-list-rendered", moveFAQ);
  window.addEventListener("popstate", moveFAQ);
})();
