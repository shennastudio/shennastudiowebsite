'use client';

import React from 'react';

interface ShippingLabelProps {
  order: {
    orderNumber: string;
    customerName: string;
    shippingAddress: string;
    shippingAddress2?: string;
    shippingCity: string;
    shippingState: string;
    shippingZip: string;
    shippingCountry: string;
    customerPhone?: string | null;
  };
  carrier: 'USPS' | 'UPS' | 'FedEx';
  trackingNumber: string;
  service: string;
  weight?: string;
  date?: string;
}

/**
 * 4x6 Shipping Label Component
 * Designed for thermal bluetooth printers
 * @see https://www.shippinglabels.com/4x6-shipping-label-specs
 */
export const ShippingLabel = React.forwardRef<HTMLDivElement, ShippingLabelProps>(
  ({ order, carrier, trackingNumber, service, weight, date }, ref) => {
    // Carrier-specific colors and logos
    const carrierConfig = {
      USPS: {
        name: 'USPS',
        color: '#333',
        bgColor: '#fff',
        barColor: '#004B87',
        serviceName: service || 'PRIORITY MAIL',
      },
      UPS: {
        name: 'UPS',
        color: '#351c15',
        bgColor: '#FFB500',
        barColor: '#351c15',
        serviceName: service || 'GROUND',
      },
      FedEx: {
        name: 'FEDEX',
        color: '#4D148C',
        bgColor: '#fff',
        barColor: '#4D148C',
        serviceName: service || 'GROUND',
      },
    };

    const config = carrierConfig[carrier];

    return (
      <div
        ref={ref}
        className="bg-white"
        style={{
          width: '6in',
          height: '4in',
          padding: '0.125in',
          fontFamily: 'Arial, Helvetica, sans-serif',
        }}
      >
        {/* Header with Carrier */}
        <div
          className="flex justify-between items-start mb-2"
          style={{ borderBottom: `2px solid ${config.color}`, paddingBottom: '8px' }}
        >
          <div>
            <div
              className="font-bold"
              style={{
                fontSize: '28px',
                color: config.color,
                letterSpacing: '2px',
              }}
            >
              {config.name}
            </div>
            <div style={{ fontSize: '10px', color: config.color, marginTop: '2px' }}>
              {config.serviceName}
            </div>
          </div>
          <div className="text-right">
            <div style={{ fontSize: '9px', color: '#666' }}>Tracking #</div>
            <div
              className="font-mono font-bold"
              style={{
                fontSize: '14px',
                color: config.color,
                letterSpacing: '1px',
              }}
            >
              {trackingNumber}
            </div>
          </div>
        </div>

        {/* From Address */}
        <div className="mb-3">
          <div
            className="font-bold"
            style={{
              fontSize: '11px',
              color: '#666',
              marginBottom: '4px',
            }}
          >
            FROM:
          </div>
          <div style={{ fontSize: '14px', color: '#000', lineHeight: '1.3' }}>
            <div className="font-bold">Shenna Studio</div>
            <div>PO Box 1234</div>
            <div>South Padre Island, TX 78597</div>
          </div>
        </div>

        {/* To Address - Large and Clear */}
        <div
          className="mb-3"
          style={{
            border: `2px solid ${config.color}`,
            borderRadius: '4px',
            padding: '12px',
            backgroundColor: '#fff',
          }}
        >
          <div
            className="font-bold"
            style={{
              fontSize: '10px',
              color: config.color,
              marginBottom: '6px',
              textTransform: 'uppercase',
            }}
          >
            To:
          </div>
          <div style={{ fontSize: '18px', color: '#000', lineHeight: '1.4', fontWeight: 'bold' }}>
            <div>{order.customerName}</div>
            <div>{order.shippingAddress}</div>
            {order.shippingAddress2 && <div>{order.shippingAddress2}</div>}
            <div>
              {order.shippingCity}, {order.shippingState} {order.shippingZip}
            </div>
            <div style={{ fontSize: '14px', color: '#666' }}>{order.shippingCountry}</div>
          </div>
          {order.customerPhone && (
            <div style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>
              Phone: {order.customerPhone}
            </div>
          )}
        </div>

        {/* Bottom Section: Barcode and Info */}
        <div className="flex justify-between items-end">
          {/* Barcode */}
          <div>
            <div
              style={{
                backgroundColor: config.barColor,
                padding: '8px 12px',
                borderRadius: '4px',
              }}
            >
              <div className="flex gap-0.5">
                {[...Array(35)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-white"
                    style={{
                      width: `${2 + Math.random() * 3}px`,
                      height: '40px',
                    }}
                  />
                ))}
              </div>
              <div
                className="font-mono text-center mt-1"
                style={{
                  fontSize: '12px',
                  color: '#fff',
                  letterSpacing: '3px',
                }}
              >
                {trackingNumber}
              </div>
            </div>
          </div>

          {/* Service and Weight Info */}
          <div className="text-right" style={{ fontSize: '11px', color: '#666' }}>
            {weight && <div>WT: {weight} LB</div>}
            <div>{date || new Date().toLocaleDateString()}</div>
            <div className="font-bold" style={{ color: config.color }}>
              {order.shippingZip}
            </div>
          </div>
        </div>

        {/* Order Number */}
        <div
          className="text-center mt-2"
          style={{
            fontSize: '10px',
            color: '#666',
            borderTop: '1px solid #ddd',
            paddingTop: '4px',
          }}
        >
          Order #: {order.orderNumber}
        </div>
      </div>
    );
  }
);

ShippingLabel.displayName = 'ShippingLabel';

/**
 * USPS 4x6 Label - Pre-configured
 */
export const USPSLabel = React.forwardRef<HTMLDivElement, Omit<ShippingLabelProps, 'carrier'>>(
  (props, ref) => <ShippingLabel ref={ref} {...props} carrier="USPS" />,
);
USPSLabel.displayName = 'USPSLabel';

/**
 * UPS 4x6 Label - Pre-configured
 */
export const UPSLabel = React.forwardRef<HTMLDivElement, Omit<ShippingLabelProps, 'carrier'>>(
  (props, ref) => <ShippingLabel ref={ref} {...props} carrier="UPS" />,
);
UPSLabel.displayName = 'UPSLabel';

/**
 * FedEx 4x6 Label - Pre-configured
 */
export const FedExLabel = React.forwardRef<HTMLDivElement, Omit<ShippingLabelProps, 'carrier'>>(
  (props, ref) => <ShippingLabel ref={ref} {...props} carrier="FedEx" />,
);
FedExLabel.displayName = 'FedExLabel';
