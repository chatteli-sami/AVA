import { testimonials } from "./content";

export default function TestimonialsSection() {
  return (
    <section className="testimonials" id="testimonials">
      <div className="container">
        <div className="section-title">
          <h2>L’Expérience PROMED GROUP</h2>
          <p>Découvrez pourquoi nos résidents ont choisi l’excellence.</p>
        </div>
        <div className="testimonial-grid">
          {testimonials.map((item) => (
            <article className="testimonial-card" key={item.author}>
              <p className="testimonial-content">« {item.quote} »</p>
              <div className="testimonial-author">
                <div className="author-image"><img src={item.image} alt={item.author} width={72} height={72} loading="lazy" /></div>
                <div className="author-info"><h4>{item.author}</h4><p>{item.role}</p></div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
