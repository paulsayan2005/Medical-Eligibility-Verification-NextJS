export default function Footer() {
  return (
    <footer className="w-full py-8 text-center text-sm text-foreground/50 border-t border-border/50 mt-auto">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <p>© {new Date().getFullYear()} MedVerify. Powered by Midnight Network.</p>
        <div className="flex gap-4">
          <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}
