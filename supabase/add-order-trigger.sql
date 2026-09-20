-- ===================================================================
-- DB Trigger: Auto-subtract stock when order item is created
-- Run this in Supabase SQL Editor
-- ===================================================================

CREATE OR REPLACE FUNCTION public.subtract_stock_on_order_item()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.products
  SET stock = GREATEST(0, COALESCE(stock, 0) - NEW.quantity)
  WHERE id = NEW.product_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.restore_stock_on_order_item_delete()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.products
  SET stock = COALESCE(stock, 0) + OLD.quantity
  WHERE id = OLD.product_id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_subtract_stock ON public.order_items;
CREATE TRIGGER trigger_subtract_stock
  AFTER INSERT ON public.order_items
  FOR EACH ROW
  EXECUTE FUNCTION public.subtract_stock_on_order_item();

DROP TRIGGER IF EXISTS trigger_restore_stock ON public.order_items;
CREATE TRIGGER trigger_restore_stock
  AFTER DELETE ON public.order_items
  FOR EACH ROW
  EXECUTE FUNCTION public.restore_stock_on_order_item_delete();
