-- ===================================================================
-- Migration: Database Trigger to automatically sync product stock on checkout
-- Eksekusi query ini pada Supabase SQL Editor (Dashboard > SQL Editor)
-- ===================================================================

-- 1. Trigger Function: Pengurangan stok otomatis saat item pesanan dibuat
CREATE OR REPLACE FUNCTION public.subtract_stock_on_order_item()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.products
  SET stock = GREATEST(0, COALESCE(stock, 0) - NEW.quantity)
  WHERE id = NEW.product_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Trigger Function: Pengembalian stok otomatis jika item pesanan dibatalkan/dihapus
CREATE OR REPLACE FUNCTION public.restore_stock_on_order_item_delete()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.products
  SET stock = COALESCE(stock, 0) + OLD.quantity
  WHERE id = OLD.product_id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Pasang Trigger pada tabel order_items untuk INSERT
DROP TRIGGER IF EXISTS trigger_subtract_stock ON public.order_items;
CREATE TRIGGER trigger_subtract_stock
  AFTER INSERT ON public.order_items
  FOR EACH ROW
  EXECUTE FUNCTION public.subtract_stock_on_order_item();

-- 4. Pasang Trigger pada tabel order_items untuk DELETE
DROP TRIGGER IF EXISTS trigger_restore_stock ON public.order_items;
CREATE TRIGGER trigger_restore_stock
  AFTER DELETE ON public.order_items
  FOR EACH ROW
  EXECUTE FUNCTION public.restore_stock_on_order_item_delete();
