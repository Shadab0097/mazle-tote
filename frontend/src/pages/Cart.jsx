import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart, updateQuantity } from '../store/cartSlice';
import {
  FiMinus,
  FiPlus,
  FiX,
  FiArrowRight,
  FiShoppingBag
} from 'react-icons/fi';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { useToast } from '../context/ToastContext';

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.cart);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const toast = useToast();

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 75 ? 0 : 15;
  const total = subtotal + shipping;

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      navigate('/checkout');
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center">
        <div className="text-center p-8">
          <FiShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Your Bag is Empty</h2>
          <p className="text-gray-500 mb-6">Looks like you haven't added anything yet.</p>
          <Link to="/products"><Button>Start Shopping</Button></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)] py-24 md:py-28">
      <Container>
        <h1 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">Shopping Bag</h1>

        <div className="grid lg:grid-cols-3 gap-8 md:gap-12">
          {/* Items */}
          <div className="lg:col-span-2 space-y-6">
            {items.map((item) => (
              <Card key={item.product} className="p-4 md:p-6 flex gap-4 md:gap-6 items-start">
                <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300"><FiShoppingBag /></div>
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex justify-between mb-2">
                    <h3 className="font-semibold text-lg">{item.name}</h3>
                    <button onClick={() => {
                      dispatch(removeFromCart(item.product));
                      toast.success('Item removed from cart');
                    }} className="text-gray-400 hover:text-red-500">
                      <FiX />
                    </button>
                  </div>
                  <p className="text-gray-500 mb-4">${item.price}</p>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center border border-gray-200 rounded-lg">
                      <button
                        className="p-2 hover:bg-gray-50 text-gray-500"
                        onClick={() => dispatch(updateQuantity({ productId: item.product, quantity: Math.max(1, item.quantity - 1) }))}
                      >
                        <FiMinus className="w-3 h-3" />
                      </button>
                      <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                      <button
                        className="p-2 hover:bg-gray-50 text-gray-500"
                        onClick={() => dispatch(updateQuantity({ productId: item.product, quantity: item.quantity + 1 }))}
                      >
                        <FiPlus className="w-3 h-3" />
                      </button>
                    </div>
                    <span className="font-semibold ml-auto">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-24 bg-gray-50 border-gray-100">
              <h2 className="font-bold text-xl mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4 mb-6">
                <div className="flex justify-between items-end">
                  <span className="font-bold text-lg">Total</span>
                  <span className="font-bold text-2xl text-[var(--color-primary)]">${total.toFixed(2)}</span>
                </div>
              </div>

              <Button size="lg" className="w-full" onClick={handleCheckout}>
                Checkout <FiArrowRight className="ml-2" />
              </Button>
            </Card>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Cart;