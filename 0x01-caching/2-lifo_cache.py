#!/usr/bin/python3
"""LIFOCache that inherits from BaseChaching"""
from base_caching import BaseCaching


class LIFOCache(BaseCaching):
    """From BaseChaching to LIFOChaching"""

    def __init__(self):
        """Initializing"""
        super().__init__()

    def put(self, key, item):
        """Must assign to self, key, item"""
        if key and item:
            if len(self.cache_data) >= BaseCaching.MAX_ITEMS:
                removed = list(self.cache_data.keys())[-1]
                self.cache_data.pop(removed)
                print("DISCARD: {}".format(removed))
            self.cache_data[key] = item

    def get(self, key):
        """Return the value in self.cache_data"""
        return self.cache_data.get(key)
