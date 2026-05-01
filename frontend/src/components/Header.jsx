function Header() {
  return (
    <header className="app-header">
      <div className="app-header-logo">🫀</div>
      <div style={{ flex: 1 }}>
        <div className="app-header-title">Cath Lab Inventory System</div>
        <div className="app-header-subtitle">
          Inventory monitoring and usage tracking for hospital staff
        </div>
      </div>
      <span className="app-header-badge">Hospital Internal</span>
    </header>
  );
}

export default Header;
