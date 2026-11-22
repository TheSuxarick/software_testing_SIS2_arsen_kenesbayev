import http from 'http';
import { URL } from 'url';

const PORT = Number(process.env.PORT || 3000);

const users = new Map();
const sessions = new Map();

const products = [
  { id: 1, name: 'Combination Pliers', price: 14.15 },
  { id: 2, name: 'Pliers', price: 12.01 },
  { id: 3, name: 'Bolt Cutters', price: 48.41 },
  { id: 4, name: 'Long Nose Pliers', price: 14.24 },
];

function parseBody(req) {
  return new Promise((resolve) => {
    let data = '';
    req.on('data', (chunk) => (data += chunk));
    req.on('end', () => {
      try {
        resolve(data ? JSON.parse(data) : {});
      } catch {
        resolve({});
      }
    });
  });
}

function renderLayout(title, body) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${title}</title>
  <style>
    body { font-family: sans-serif; max-width: 900px; margin: 20px auto; padding: 0 16px; }
    nav { display: flex; gap: 16px; margin-bottom: 24px; padding-bottom: 12px; border-bottom: 1px solid #ddd; }
    .card { border: 1px solid #ddd; padding: 12px; margin-bottom: 12px; border-radius: 4px; }
    .hidden { display: none; }
    .alert { padding: 10px; margin-top: 12px; border-radius: 4px; }
    .alert-success { background: #d4edda; color: #155724; }
    .alert-danger { background: #f8d7da; color: #721c24; }
  </style>
</head>
<body>
  <nav>
    <a href="/">Home</a>
    <a href="/auth/login">Sign in</a>
    <a href="/checkout" data-test="nav-cart">Cart <span id="cart-qty" data-test="cart-quantity" class="hidden">0</span></a>
  </nav>
  ${body}
  <script>
    function updateCartBadge() {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      const total = cart.reduce((sum, item) => sum + item.qty, 0);
      const badge = document.getElementById('cart-qty');
      if (badge && total > 0) {
        badge.textContent = String(total);
        badge.classList.remove('hidden');
      }
    }
    updateCartBadge();
  </script>
</body>
</html>`;
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url || '/', `http://localhost:${PORT}`);
  const pathname = url.pathname;

  // API: Register user
  if (req.method === 'POST' && pathname === '/api/users/register') {
    const body = await parseBody(req);
    if (!body.email || !body.password) {
      res.writeHead(422, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Email and password are required' }));
      return;
    }
    users.set(body.email, {
      email: body.email,
      password: body.password,
      first_name: body.first_name || 'Test',
      last_name: body.last_name || 'User',
    });
    res.writeHead(201, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ id: users.size, email: body.email }));
    return;
  }

  // API: Login
  if (req.method === 'POST' && pathname === '/api/users/login') {
    const body = await parseBody(req);
    const user = users.get(body.email);
    if (!user || user.password !== body.password) {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Invalid email or password' }));
      return;
    }
    const token = `tok_${Date.now()}`;
    sessions.set(token, user.email);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ access_token: token }));
    return;
  }

  // API: Forgot password
  if (req.method === 'POST' && pathname === '/api/users/forgot-password') {
    const body = await parseBody(req);
    if (!users.has(body.email)) {
      res.writeHead(422, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'The selected email is invalid' }));
      return;
    }
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: true }));
    return;
  }

  // Page: Home / Catalog
  if (req.method === 'GET' && pathname === '/') {
    const cards = products
      .map(
        (p) => `
      <div class="card">
        <a href="/product/${p.id}" data-test="product-name">${p.name}</a>
        <div data-test="product-price">$${p.price.toFixed(2)}</div>
      </div>`,
      )
      .join('');
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(renderLayout('Toolshop - Catalog', `<h1>Products</h1>${cards}`));
    return;
  }

  // Page: Product detail
  if (req.method === 'GET' && pathname.startsWith('/product/')) {
    const id = Number(pathname.split('/')[2]);
    const product = products.find((p) => p.id === id) || products[0];
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(
      renderLayout(
        product.name,
        `
      <h1 data-test="product-name">${product.name}</h1>
      <p>$<span data-test="unit-price">${product.price.toFixed(2)}</span></p>
      <button id="add-btn" data-test="add-to-cart">Add to cart</button>
      <script>
        document.getElementById('add-btn').addEventListener('click', () => {
          const cart = JSON.parse(localStorage.getItem('cart') || '[]');
          const existing = cart.find(i => i.id === ${product.id});
          if (existing) existing.qty += 1;
          else cart.push({ id: ${product.id}, name: ${JSON.stringify(product.name)}, price: ${product.price}, qty: 1 });
          localStorage.setItem('cart', JSON.stringify(cart));
          updateCartBadge();
        });
      </script>`,
      ),
    );
    return;
  }

  // Page: Register
  if (req.method === 'GET' && pathname === '/auth/register') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(
      renderLayout(
        'Register',
        `
      <h1>Customer registration</h1>
      <form id="register-form">
        <input data-test="first-name" placeholder="First name" required />
        <input data-test="last-name" placeholder="Last name" required />
        <input data-test="dob" type="date" required />
        <select data-test="country">
          <option value="US">United States</option>
          <option value="KZ">Kazakhstan</option>
          <option value="AT">Austria</option>
        </select>
        <input data-test="postal_code" placeholder="Postal code" required />
        <input data-test="house_number" placeholder="House number" required />
        <input data-test="street" placeholder="Street" required />
        <input data-test="city" placeholder="City" required />
        <input data-test="state" placeholder="State" required />
        <input data-test="phone" placeholder="Phone" required />
        <input data-test="email" type="email" placeholder="Email" required />
        <input data-test="password" type="password" placeholder="Password" required />
        <button type="submit" data-test="register-submit">Register</button>
      </form>
      <script>
        document.getElementById('register-form').addEventListener('submit', async (e) => {
          e.preventDefault();
          const email = document.querySelector('[data-test="email"]').value;
          const password = document.querySelector('[data-test="password"]').value;
          const res = await fetch('/api/users/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
          });
          if (res.ok) window.location.href = '/auth/login';
        });
      </script>`,
      ),
    );
    return;
  }

  // Page: Login
  if (req.method === 'GET' && pathname === '/auth/login') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(
      renderLayout(
        'Login',
        `
      <h1>Login</h1>
      <form id="login-form">
        <input data-test="email" type="email" placeholder="Email" required />
        <input data-test="password" type="password" placeholder="Password" required />
        <button type="submit" data-test="login-submit">Login</button>
      </form>
      <div id="login-error" data-test="login-error" class="alert alert-danger hidden"></div>
      <script>
        document.getElementById('login-form').addEventListener('submit', async (e) => {
          e.preventDefault();
          const email = document.querySelector('[data-test="email"]').value;
          const password = document.querySelector('[data-test="password"]').value;
          const res = await fetch('/api/users/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
          });
          if (res.ok) {
            const data = await res.json();
            localStorage.setItem('auth_token', data.access_token);
            window.location.href = '/account';
          } else {
            const err = document.getElementById('login-error');
            err.textContent = 'Invalid email or password';
            err.classList.remove('hidden');
          }
        });
      </script>`,
      ),
    );
    return;
  }

  // Page: Account
  if (req.method === 'GET' && pathname === '/account') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(renderLayout('My account', `<h1 data-test="page-title">My account</h1>`));
    return;
  }

  // Page: Checkout
  if (req.method === 'GET' && pathname === '/checkout') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(
      renderLayout(
        'Checkout',
        `
      <h1>Checkout</h1>
      <div id="step-1">
        <span id="cart-title" data-test="product-title"></span>
        <input id="cart-quantity-input" type="number" data-test="product-quantity" value="1" />
        <button id="p1" data-test="proceed-1">Proceed to checkout</button>
      </div>
      <div id="step-2" class="hidden">
        <p>Signed in</p>
        <button id="p2" data-test="proceed-2">Proceed to checkout</button>
      </div>
      <div id="step-3" class="hidden">
        <input data-test="postal_code" placeholder="Postal code" />
        <input data-test="house_number" placeholder="House number" />
        <input data-test="state" placeholder="State" />
        <button id="p3" data-test="proceed-3">Proceed to checkout</button>
      </div>
      <div id="step-4" class="hidden">
        <select data-test="payment-method">
          <option value="bank-transfer">Bank Transfer</option>
          <option value="cash-on-delivery">Cash on Delivery</option>
          <option value="credit-card">Credit Card</option>
        </select>
        <button id="finish-btn" data-test="finish">Confirm</button>
        <div id="success-msg" data-test="payment-success-message" class="alert alert-success hidden">Payment was successful</div>
      </div>
      <script>
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        if (cart.length > 0) {
          document.getElementById('cart-title').textContent = cart[0].name;
          document.getElementById('cart-quantity-input').value = String(cart[0].qty);
        }
        document.getElementById('p1').addEventListener('click', () => {
          document.getElementById('step-1').classList.add('hidden');
          document.getElementById('step-2').classList.remove('hidden');
        });
        document.getElementById('p2').addEventListener('click', () => {
          document.getElementById('step-2').classList.add('hidden');
          document.getElementById('step-3').classList.remove('hidden');
        });
        document.getElementById('p3').addEventListener('click', () => {
          document.getElementById('step-3').classList.add('hidden');
          document.getElementById('step-4').classList.remove('hidden');
        });
        document.getElementById('finish-btn').addEventListener('click', () => {
          localStorage.removeItem('cart');
          document.getElementById('success-msg').classList.remove('hidden');
        });
      </script>`,
      ),
    );
    return;
  }

  // Page: Forgot password
  if (req.method === 'GET' && pathname === '/auth/forgot-password') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(
      renderLayout(
        'Forgot Password',
        `
      <h1>Forgot Password</h1>
      <form id="forgot-form">
        <input data-test="email" type="email" placeholder="Your email" required />
        <button type="submit" data-test="forgot-password-submit">Set New Password</button>
      </form>
      <div id="alert-box"></div>
      <script>
        document.getElementById('forgot-form').addEventListener('submit', async (e) => {
          e.preventDefault();
          const email = document.querySelector('[data-test="email"]').value;
          const res = await fetch('/api/users/forgot-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
          });
          const box = document.getElementById('alert-box');
          if (res.ok) {
            box.innerHTML = '<div role="alert" class="alert alert-success mt-3">Password reset link sent</div>';
          } else {
            box.innerHTML = '<div role="alert" class="alert alert-danger mt-3">The selected email is invalid</div>';
          }
        });
      </script>`,
      ),
    );
    return;
  }

  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('Not found');
});

server.listen(PORT, () => {
  console.log(`Test app server listening on http://localhost:${PORT}`);
});
